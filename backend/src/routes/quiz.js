import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

// Get quiz by ID with questions
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [quizzes] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [req.params.id]);
    
    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quiz = quizzes[0];
    
    const [questions] = await pool.query(`
      SELECT q.*, 
        (SELECT JSON_ARRAYAGG(o.option_text) 
         FROM quiz_options o 
         WHERE o.question_id = q.id) as options
      FROM quiz_questions q
      WHERE q.quiz_id = ?
    `, [req.params.id]);

    res.json({
      ...quiz,
      questions: questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Error fetching quiz' });
  }
});

// Submit quiz answers
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = req.params.id;
    
    // Get correct answers
    const [questions] = await pool.query(
      'SELECT id, correct_answer FROM quiz_questions WHERE quiz_id = ?',
      [quizId]
    );

    // Calculate score
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        score++;
      }
    });

    const finalScore = (score / questions.length) * 100;

    // Save submission
    await pool.query(
      'INSERT INTO quiz_submissions (quiz_id, user_id, score, answers) VALUES (?, ?, ?, ?)',
      [quizId, req.user.id, finalScore, JSON.stringify(answers)]
    );

    res.json({
      score: finalScore,
      totalQuestions: questions.length,
      correctAnswers: score
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
});

export default router;