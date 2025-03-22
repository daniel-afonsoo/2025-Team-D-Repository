const mysql = require('mysql2')

const pool = mysql.createPool({
  host: '192.168.56.102',
  user: 'gpadmin',
  password: '123qwe',
  database: 'easyscheduleipt',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

 

module.exports = pool