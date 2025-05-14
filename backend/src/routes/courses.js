import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/course-content';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'video/mp4', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, MP4, JPEG, and PNG files are allowed.'));
    }
  }
});

// Get all courses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.*, u.name as teacher_name 
      FROM courses c 
      LEFT JOIN users u ON c.teacher_id = u.id
    `);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get course by ID with content
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.*, u.name as teacher_name 
      FROM courses c 
      LEFT JOIN users u ON c.teacher_id = u.id 
      WHERE c.id = ?
    `, [req.params.id]);

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = courses[0];

    const [content] = await pool.query(`
      SELECT id, title, content_type, content, file_path, created_at
      FROM course_content 
      WHERE course_id = ? 
      ORDER BY id
    `, [req.params.id]);

    res.json({
      ...course,
      content
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Create new course
router.post('/', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO courses (title, description, teacher_id) VALUES (?, ?, ?)',
      [title, description, req.user.id]
    );

    const [newCourse] = await pool.query(
      'SELECT c.*, u.name as teacher_name FROM courses c LEFT JOIN users u ON c.teacher_id = u.id WHERE c.id = ?',
      [result.insertId]
    );

    res.status(201).json(newCourse[0]);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course' });
  }
});

// Add course content with file upload
router.post('/:id/content', authenticateToken, authorizeRole(['teacher', 'admin']), upload.single('file'), async (req, res) => {
  try {
    const { title, content_type } = req.body;
    const courseId = req.params.id;
    const filePath = req.file ? req.file.path : null;

    // Verify course exists and user has access
    const [courses] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND (teacher_id = ? OR ? = "admin")',
      [courseId, req.user.id, req.user.role]
    );

    if (courses.length === 0) {
      if (filePath) fs.unlinkSync(filePath); // Delete uploaded file if course check fails
      return res.status(404).json({ message: 'Course not found or access denied' });
    }

    const [result] = await pool.query(
      'INSERT INTO course_content (course_id, title, content_type, file_path) VALUES (?, ?, ?, ?)',
      [courseId, title, content_type, filePath]
    );

    const [newContent] = await pool.query(
      'SELECT * FROM course_content WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newContent[0]);
  } catch (error) {
    console.error('Error adding course content:', error);
    if (req.file) fs.unlinkSync(req.file.path); // Delete uploaded file if query fails
    res.status(500).json({ message: 'Error adding course content' });
  }
});

// Download course content file
router.get('/:courseId/content/:contentId/download', authenticateToken, async (req, res) => {
  try {
    const [content] = await pool.query(
      'SELECT cc.*, c.teacher_id FROM course_content cc JOIN courses c ON cc.course_id = c.id WHERE cc.id = ? AND cc.course_id = ?',
      [req.params.contentId, req.params.courseId]
    );

    if (content.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const filePath = content[0].file_path;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Error downloading content:', error);
    res.status(500).json({ message: 'Error downloading content' });
  }
});

// Update course content
router.put('/:courseId/content/:contentId', authenticateToken, authorizeRole(['teacher', 'admin']), upload.single('file'), async (req, res) => {
  try {
    const { title, content_type } = req.body;
    const filePath = req.file ? req.file.path : null;

    // Get existing content to check file path
    const [existingContent] = await pool.query(
      'SELECT file_path FROM course_content WHERE id = ?',
      [req.params.contentId]
    );

    const [result] = await pool.query(
      `UPDATE course_content cc
       JOIN courses c ON cc.course_id = c.id
       SET cc.title = ?, cc.content_type = ?, cc.file_path = COALESCE(?, cc.file_path)
       WHERE cc.id = ? AND cc.course_id = ? AND (c.teacher_id = ? OR ? = "admin")`,
      [title, content_type, filePath, req.params.contentId, req.params.courseId, req.user.id, req.user.role]
    );

    if (result.affectedRows === 0) {
      if (filePath) fs.unlinkSync(filePath);
      return res.status(404).json({ message: 'Content not found or access denied' });
    }

    // Delete old file if new file was uploaded
    if (filePath && existingContent[0].file_path) {
      fs.unlinkSync(existingContent[0].file_path);
    }

    const [updatedContent] = await pool.query(
      'SELECT * FROM course_content WHERE id = ?',
      [req.params.contentId]
    );

    res.json(updatedContent[0]);
  } catch (error) {
    console.error('Error updating course content:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Error updating course content' });
  }
});

// Delete course content
router.delete('/:courseId/content/:contentId', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    // Get file path before deleting
    const [content] = await pool.query(
      'SELECT file_path FROM course_content WHERE id = ?',
      [req.params.contentId]
    );

    const [result] = await pool.query(
      `DELETE cc FROM course_content cc
       JOIN courses c ON cc.course_id = c.id
       WHERE cc.id = ? AND cc.course_id = ? AND (c.teacher_id = ? OR ? = "admin")`,
      [req.params.contentId, req.params.courseId, req.user.id, req.user.role]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Content not found or access denied' });
    }

    // Delete file if it exists
    if (content[0]?.file_path && fs.existsSync(content[0].file_path)) {
      fs.unlinkSync(content[0].file_path);
    }

    res.json({ message: 'Course content deleted successfully' });
  } catch (error) {
    console.error('Error deleting course content:', error);
    res.status(500).json({ message: 'Error deleting course content' });
  }
});

export default router;