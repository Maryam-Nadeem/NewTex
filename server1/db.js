const mysql = require('mysql');
const db = mysql.createConnection({
    user: 'root',
    password: 'marsql',
    host: 'localhost',
    database:'blockchaindb' ,
    
});
db.connect((err)=>{
    if(err)
    console.log(err.message);
});

module.exports= db;

