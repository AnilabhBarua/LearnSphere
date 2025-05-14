import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

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
    // Get course details
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

    // Get course content
    const [content] = await pool.query(`
      SELECT id, title, content_type, content, created_at
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

// Create new course (teachers and admins only)
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

// Add course content
router.post('/:id/content', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, content, content_type } = req.body;
    const courseId = req.params.id;

    // Verify course exists and user has access
    const [courses] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND (teacher_id = ? OR ? = "admin")',
      [courseId, req.user.id, req.user.role]
    );

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found or access denied' });
    }

    const [result] = await pool.query(
      'INSERT INTO course_content (course_id, title, content, content_type) VALUES (?, ?, ?, ?)',
      [courseId, title, content, content_type]
    );

    const [newContent] = await pool.query(
      'SELECT * FROM course_content WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newContent[0]);
  } catch (error) {
    console.error('Error adding course content:', error);
    res.status(500).json({ message: 'Error adding course content' });
  }
});

// Update course
router.put('/:id', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await pool.query(
      'UPDATE courses SET title = ?, description = ? WHERE id = ? AND (teacher_id = ? OR ? = "admin")',
      [title, description, req.params.id, req.user.id, req.user.role]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found or access denied' });
    }

    const [updatedCourse] = await pool.query(
      'SELECT c.*, u.name as teacher_name FROM courses c LEFT JOIN users u ON c.teacher_id = u.id WHERE c.id = ?',
      [req.params.id]
    );

    res.json(updatedCourse[0]);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
});

// Delete course
router.delete('/:id', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Delete course content first
      await connection.query(
        'DELETE FROM course_content WHERE course_id = ?',
        [req.params.id]
      );

      // Delete the course
      const [result] = await connection.query(
        'DELETE FROM courses WHERE id = ? AND (teacher_id = ? OR ? = "admin")',
        [req.params.id, req.user.id, req.user.role]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ message: 'Course not found or access denied' });
      }

      await connection.commit();
      connection.release();
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// Update course content
router.put('/:courseId/content/:contentId', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, content, content_type } = req.body;
    const [result] = await pool.query(
      `UPDATE course_content cc
       JOIN courses c ON cc.course_id = c.id
       SET cc.title = ?, cc.content = ?, cc.content_type = ?
       WHERE cc.id = ? AND cc.course_id = ? AND (c.teacher_id = ? OR ? = "admin")`,
      [title, content, content_type, req.params.contentId, req.params.courseId, req.user.id, req.user.role]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Content not found or access denied' });
    }

    const [updatedContent] = await pool.query(
      'SELECT * FROM course_content WHERE id = ?',
      [req.params.contentId]
    );

    res.json(updatedContent[0]);
  } catch (error) {
    console.error('Error updating course content:', error);
    res.status(500).json({ message: 'Error updating course content' });
  }
});

// Delete course content
router.delete('/:courseId/content/:contentId', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE cc FROM course_content cc
       JOIN courses c ON cc.course_id = c.id
       WHERE cc.id = ? AND cc.course_id = ? AND (c.teacher_id = ? OR ? = "admin")`,
      [req.params.contentId, req.params.courseId, req.user.id, req.user.role]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Content not found or access denied' });
    }

    res.json({ message: 'Course content deleted successfully' });
  } catch (error) {
    console.error('Error deleting course content:', error);
    res.status(500).json({ message: 'Error deleting course content' });
  }
});

export default router;