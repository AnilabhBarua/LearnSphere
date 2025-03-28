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
      SELECT * FROM course_content 
      WHERE course_id = ? 
      ORDER BY order_number
    `, [req.params.id]);

    // Get quizzes
    const [quizzes] = await pool.query(`
      SELECT * FROM quizzes 
      WHERE course_id = ?
    `, [req.params.id]);

    res.json({
      ...course,
      content,
      quizzes
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Create new course (teachers and admins only)
router.post('/', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, description, thumbnail_url } = req.body;
    const [result] = await pool.query(
      'INSERT INTO courses (title, description, thumbnail_url, teacher_id) VALUES (?, ?, ?, ?)',
      [title, description, thumbnail_url, req.user.id]
    );
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      thumbnail_url,
      teacher_id: req.user.id
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course' });
  }
});

// Update course
router.put('/:id', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, description, thumbnail_url } = req.body;
    await pool.query(
      'UPDATE courses SET title = ?, description = ?, thumbnail_url = ? WHERE id = ? AND (teacher_id = ? OR ? = "admin")',
      [title, description, thumbnail_url, req.params.id, req.user.id, req.user.role]
    );
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
});

// Delete course
router.delete('/:id', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM courses WHERE id = ? AND (teacher_id = ? OR ? = "admin")',
      [req.params.id, req.user.id, req.user.role]
    );
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// Get course quizzes
router.get('/:id/quizzes', authenticateToken, async (req, res) => {
  try {
    const [quizzes] = await pool.query(`
      SELECT q.*, 
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count
      FROM quizzes q
      WHERE q.course_id = ?
    `, [req.params.id]);
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Error fetching quizzes' });
  }
});

export default router;