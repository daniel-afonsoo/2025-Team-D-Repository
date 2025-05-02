//imports 
const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js') 
const bcrypt = require('bcrypt')
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Demasiadas tentativas de login. Tente novamente mais tarde.'
})

//FUNCIONA
router.post('/auth/login', authLimiter, async (req,res) => {
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
