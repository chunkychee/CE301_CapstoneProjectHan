const express = require('express'); //dont convert to ES6
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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
app.post('/addinclientsignup', async (req, res) => {
    try {
      const query = "SELECT * FROM clientsignup WHERE clientemail = ?";
      db.query(query, [req.body.clientemail], async (err, data) => {
        if(err){
           console.log(res.json(err))
        } 
        else if (data.length) {
            // If email exists in the database, return an error message
            return res.status(409).json({ message: "Email already exists" });
        } else {
          // If email does not exist in the database, hash the password and insert the client details
          const salt = await bcrypt.genSalt();
          const hashedpassword = await bcrypt.hash(req.body.clientpassword, salt);
          const sql = "INSERT INTO clientsignup (clientname, clientusername, clientpassword, clientgender, clientnumber, clientlifestyle, clientoccupation, clientemail, DOB) VALUES (?)";
          const values = [
            req.body.clientname,
            req.body.clientusername,
            hashedpassword,
            req.body.clientgender,
            req.body.clientnumber,
            req.body.clientlifestyle,
            req.body.clientoccupation,
            req.body.clientemail,
            req.body.DOB
          ];
  
          db.query(sql, [values], (err, data) => {
            if (err){
                console.log(res.json(err))
            }else{
                res.status(201).json({ message: "Client signup successful" });
            }
          });
        }
      });
    } catch (err) {
      console.log(res.json(err));
    }
  });


  app.post('/addinconsultants', async (req, res) => {
    try {
      const query = "SELECT * FROM consultantsignup WHERE consultantemail = ?";
      db.query(query, [req.body.consultantemail], async (err, data) => {
        if(err){
           console.log(res.json(err))
        } 
        else if (data.length) {
            // If email exists in the database, return an error message
            return res.status(409).json({ message: "Email already exists" });
        } else {
          // If email does not exist in the database, hash the password and insert the client details
          const salt = await bcrypt.genSalt();
          const hashedpassword = await bcrypt.hash(req.body.consultantemail, salt);
          const sql = "INSERT INTO consultantsignup (consultantname,consultantnumber,consultantemail,consultantpassword,consultantgender,DOB,hearfromus) VALUES (?)";
        const values = 
        [req.body.consultantname,
        req.body.consultantnumber,
        req.body.consultantemail,
        hashedpassword,
        req.body.consultantgender,
        req.body.DOB,
        req.body.hearfromus];
  
          db.query(sql, [values], (err, data) => {
            if (err){
                console.log(res.json(err))
            }else{
                res.status(201).json({ message: "consultant signup successful" });
            }
          });
        }
      });
    } catch (err) {
      console.log(res.json(err));
    }
  });


  
app.listen('3004', () => {
    console.log('Server started on port 3004');
})
app.post('/addin',(req,res) => {
    const sql = "INSERT INTO clientsignup (clientname,clientgender,clientnumber,clientaddress,clientlifestyle,clientoccupation,clientemail,DOB) VALUES (?)";
    const values = 
    ["Laura","F","91091209","Telok Ayer st 90 blk 90 S120390","Active", "Finance manager", "Laura9029$$@gmail.com","1980-09-10"];

    db.query(sql,[values],(err,data) => {
        if (err) return res.json(err);
        return res.json("inserted in already");
    });
});
