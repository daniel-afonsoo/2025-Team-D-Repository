//imports 
const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js') 
const bcrypt = require('bcrypt')
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 6,
    message: 'Demasiadas tentativas de login. Tente novamente mais tarde.'
})

const loginAttempts = new Map();

const emailLimiter = (req, res, next) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json({message: 'Email is required'});
    }

    const now = Date.now();
    const limitWindowMs = 15 * 60 * 1000;
    const maxAttempts = 5;

    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: now };
    
    if(now - attempts.firstAttempt > limitWindowMs) {
        attempts.count = 0;
    }
    
    attempts.count += 1;
    attempts.lastAttempt = now;

    
    loginAttempts.set(email, attempts);

    if(attempts.count > maxAttempts) {
        return res.status(429).json({message: 'Demasiadas tentativas de login. Tente novamente mais tarde.'});
    }

    next();
}

//FUNCIONA
router.post('/auth/login', authLimiter, emailLimiter, async (req,res) => {
    const {email,password} = req.body
    
    try {
        const query = `SELECT * FROM docente WHERE Email = ?`
        const [results] = await pool.promise().query(query, [email])
        
        // Verifica se o utilizador existe
        if (results.length === 0) {
            return res.status(401).json({message: 'Invalid email or password'})
        }
        
        // Compara a password fornecida com a password armazenada na base de dados
        const match = await bcrypt.compare(password, results[0].Password)
        
        if (match) {
            // Resetar tentativas no sucesso do login
            loginAttempts.delete(email);
            return res.status(200).json({message: 'Login successful'})
        } else {
            return res.status(401).json({message: 'Invalid email or password'})
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({error: 'Internal server error'})
    }
})

module.exports = router



//Como funciona o comparador do Bcrypt :

// $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
//  |  |                     |                           |
//  |  |                     |                           +-- Actual hash
//  |  |                     +-- Salt (22 characters)
//  |  +-- Cost factor (10)
//  +-- Algorithm version identifier (2b)
//
