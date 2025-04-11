//imports 
const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js') 


//FUNCIONA
router.post('/auth/login',(req,res) => {
    const {email,password} = req.body
    const query = `SELECT * FROM docente WHERE Email = ? AND Password = ?`
    const values = [email,password]
    pool.query(query,values,(err,result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        if(result.length > 0) {
            return res.status(200).json({message: 'Login successful'})
        } else {
            return res.status(401).json({message: 'Invalid email or password'})
        }
    })
}
)
module.exports = router