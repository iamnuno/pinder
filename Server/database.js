var mysql = require('mysql');

 const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'tony',
    password: '123456',
    database: 'pinder'
});

module.exports = connection;
