const express = require('express'); //dont convert to ES6
const mysql = require('mysql');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

//create connection
const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root123',
    database:'import'
});

//connect
db.getConnection((err) => {
    if(err){
        throw err;
    }
    console.log('Mysql connected.');
});

app.get('/get',(req,res) => {
     res.send("yo connected");
})

//correct one //insert data into clientsignup table
app.post('/addinclientsignup',(req,res) => {
    const sql = "INSERT INTO clientsignup (clientname,clientgender,clientnumber,clientaddress,clientlifestyle,clientoccupation,clientemail,DOB) VALUES (?)";
    const values = 
    [req.body.clientname,
    req.body.clientgender,
    req.body.clientnumber,
    req.body.clientaddress,
    req.body.clientlifestyle,
    req.body.clientoccupation,
    req.body.clientemail,
    req.body.DOB];

    db.query(sql,[values],(err,data) => {
        if (err) return res.json(err);
        return res.json("inserted in already");
    });
});

//correct one //insert data into consultantsignup table
app.post('/addinconsultants',(req,res) => {
    const sql = "INSERT INTO consultantsignup (consultantname,consultantnumber,consultantemail,consultantgender,DOB,hearfromus) VALUES (?)";
    const values = 
    [req.body.consultantname,
    req.body.consultantnumber,
    req.body.consultantemail,
    req.body.consultantgender,
    req.body.DOB,
    req.body.hearfromus];

    db.query(sql,[values],(err,data) => {
        if (err) return res.json(err);
        return res.json("inserted in already");
    });
});


app.post('/addin',(req,res) => {
    const sql = "INSERT INTO clientsignup (clientname,clientgender,clientnumber,clientaddress,clientlifestyle,clientoccupation,clientemail,DOB) VALUES (?)";
    const values = 
    ["Laura","F","91091209","Telok Ayer st 90 blk 90 S120390","Active", "Finance manager", "Laura9029$$@gmail.com","1980-09-10"];

    db.query(sql,[values],(err,data) => {
        if (err) return res.json(err);
        return res.json("inserted in already");
    });
});


app.listen('3004', () => {
    console.log('Server started on port 3004');
})