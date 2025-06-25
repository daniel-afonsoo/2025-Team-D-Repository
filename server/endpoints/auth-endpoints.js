// server/endpoints/auth-endpoints.js
const express = require('express');
const router = express.Router();
const pool = require('../db/connection.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: 'Demasiadas tentativas de login. Tente novamente mais tarde.'
});

const loginAttempts = new Map();

const emailLimiter = (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const now = Date.now();
  const limitWindowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  const attempts = loginAttempts.get(email) || {
    count: 0,
    firstAttempt: now,
    lastAttempt: now,
  };

  if (now - attempts.firstAttempt > limitWindowMs) {
    attempts.count = 0;
    attempts.firstAttempt = now;
  }

  attempts.count += 1;
  attempts.lastAttempt = now;
  loginAttempts.set(email, attempts);

  if (attempts.count > maxAttempts) {
    return res
      .status(429)
      .json({ message: 'Demasiadas tentativas de login. Tente novamente mais tarde.' });
  }

  next();
};

router.post('/login', authLimiter, emailLimiter, async (req, res) => {

  const { email, password } = req.body;
  try {
    // uso de alias para retornar Cod_Docente como id
    const [rows] = await pool.promise().query(
      `SELECT Cod_Docente AS id, Email, Password, role, Nome FROM docente WHERE Email = ?`,
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // reset de tentativas
    loginAttempts.delete(email);

    // gera JWT usando user.id, role, email e nome
    const token = jwt.sign(
      { userId: user.id, email, role: user.role, nome: user.Nome },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000
    }).status(200).json({ role: user.role, nome: user.Nome });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/verify', (req, res) => {
  console.log("req.cookies ===", req.cookies);
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.userId, role: decoded.role, email: decoded.email, nome: decoded.nome });
  } catch {
    res.sendStatus(403);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.sendStatus(200);
});

module.exports = router;
