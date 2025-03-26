//imports 
const express = require('express')
const pool = require('../db/connection.js')
const router = express.Router()

router.get('/getData', (req, res) => {
    const query = "select * from Docente";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Database query error:", err)
            return res.status(500).json({ error: "Database query failed" })
        }
        console.log(`Data endpoint hit successfully. Client's IP: ${req.ip}`)
        res.json(results);
    })
})

module.exports = router