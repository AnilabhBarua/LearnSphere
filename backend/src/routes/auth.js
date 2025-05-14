import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

// Mock users for testing
const mockUsers = {
  'admin@lms.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
  'teacher@lms.com': { password: 'teacher123', role: 'teacher', name: 'Teacher User' },
  'student@lms.com': { password: 'student123', role: 'student', name: 'Student User' },
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role enum values
    const validRoles = ['admin', 'teacher', 'student'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: result.insertId,
        email,
        role,
        name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        name,
        email,
        role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for mock users first
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      const mockResponse = {
        user: {
          id: Math.floor(Math.random() * 1000),
          email,
          name: mockUser.name,
          role: mockUser.role,
          created_at: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
      };
      return res.json(mockResponse);
    }

    // If not a mock user, proceed with database authentication
    const [users] = await pool.query(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from user object before sending response
    delete user.password;

    res.json({
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Handle mock token
    if (token === 'mock-jwt-token') {
      return res.json({
        id: 999,
        name: 'Mock User',
        email: 'mock@example.com',
        role: 'admin',
        created_at: new Date().toISOString()
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

export default router;