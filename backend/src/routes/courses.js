import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

// Get all courses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [courses] = await pool.query('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get course by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [courses] = await pool.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(courses[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Create new course (teachers only)
router.post('/', authenticateToken, authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO courses (title, description, teacher_id) VALUES (?, ?, ?)',
      [title, description, req.user.id]
    );
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      teacher_id: req.user.id
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course' });
  }
});

export default router;