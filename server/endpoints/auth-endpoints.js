//imports 
const express = require('express')
const router = express.Router()

// Get request test
router.get('/test', (req, res) => {
   res.json({ message: "Test endpoint hit" })
   
})

// Get request test
router.get('/users', (req, res) => {
    const users = [{ id: 1, name: "Guilherme" }, { id: 2, name: "Bill" }]
    return res.json(users)
})

module.exports = router