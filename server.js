const express = require('express'); //dont convert to ES6
const mysql = require('mysql');
const app = express();
const cors = require('cors');

const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const {TokenCreation,validatetoken} = require('./JWTutility');
const cookieParser = require('cookie-parser');


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

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
    console.log('Mysql connected on port 3004');
});

app.listen(3004, () => {
  console.log(`Server is running and listening on port 3004`);
});

app.post('/loginadmin', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = "SELECT * FROM admindb WHERE username = ? AND password = ?";
  db.query(query, [username, password], async (err, data) => {
    if (data.length) {
      // User found, send success response
      res.status(200).json({ message: 'Login successful' });
    } else {
      // User not found, send unauthorized response
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  });
});

app.post('/changefields', async (req, res) => {
  const policyIdNames = {
    policyid1: req.body.policyid1,
    policyid2: req.body.policyid2,
    policyid3: req.body.policyid3,
    policyid4: req.body.policyid4,
    policyid5: req.body.policyid5,
    policyid6: req.body.policyid6,
    policyid7: req.body.policyid7,
    policyid8: req.body.policyid8,
    policyid9: req.body.policyid9,
    policyid10: req.body.policyid10,
    policyid11: req.body.policyid11,
    policyid12: req.body.policyid12
    // Add more policy id names here if needed
  };
  const policyNames = [];
  let query = 'UPDATE policiescreation SET policyname = CASE policyid ';
  for (let i = 1; i <= 12; i++) {
    const policyIdName = policyIdNames[`policyid${i}`];
    if (policyIdName && policyIdName.trim()) {
      policyNames.push({
        index: i,
        policyname: policyIdName
      });
      query += `WHEN '${i}' THEN '${policyIdName}' `;
    }      
  }
  query += 'END WHERE policyid IN (';
  const policyIds = policyNames.map(policy => policy.index).join(',');
  query += policyIds;
  query += ');';
  console.log(query)
  try {
    db.query(query, async (error, result) => {
        if (error) {
            res.json(error);
        } else {
            res.json({ success: true });
        }
    });
  } catch (error) {
    res.json(error);
  }
});

app.get('/getpolicyname/policynames', async (req, res) => {
  try {
    const query = 'SELECT policyname FROM policiescreation WHERE policyid >= 1 AND policyid <= 12';
    db.query(query, (error, results) => {
      if (error) {
        throw error;
      }
      // Map over the results and extract the policyname values into an array
      const policyNames = results.map(result => result.policyname);

      // Return the array of policy names as the JSON response
      res.status(200).json(policyNames);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/policyname/policyid1', async (req, res) => {
  try {
    const query = "SELECT policyimage, policyid,policyname,policydescription,pricemonthly FROM policiescreation WHERE policyid = 1";
    db.query(query, (error, results) => {
      if (error) {
        throw error;
      }
      // Map over the results and extract the policyname values into an array
      const policy1details = results.map(result => ({
        policyname: result.policyname,
        policyimage: result.policyimage,
        policydescription: result.policydescription,
        pricemonthly: result.pricemonthly
      }));
      // Return the array of policy names as the JSON response
      res.status(200).json(policy1details);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/changeBuyPolicies', async (req, res) => {
  try {
    const numberOfPolicies = 12;
    let query = 'UPDATE policiescreation SET policyimage = ?, imageformat = ?, policydescription = ?, pricemonthly = ? WHERE policyid = ?';
    let promises = [];
    for (let i = 1; i <= numberOfPolicies; i++) {
      const policyImage = req.body[`policyImage${i}`]
      const imageformat = PolicyReview[`imageformat${i}`]
      const policyDescription = req.body[`policyDescription${i}`]
      const policyPrice = req.body[`policyPrice${i}`]

      if (policyImage || imageformat|| policyDescription || policyPrice) {
        promises.push(new Promise((resolve, reject) => {
          db.query(query, [policyImage,imageformat,policyDescription,policyPrice,i], (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }));
      }
      console.log(promises)
    }
    Promise.all(promises).then(() => {
      res.json({ success: true });
    }).catch((error) => {
      res.json(error);
    });

  } catch (error) {
    res.json(error);
  }
});



app.post('/addinclientlogindetails', async (req, res) => {
  try {
    const query = "SELECT * FROM clientlogindetails WHERE clientemail = ?";
    db.query(query, [req.body.clientemail], async (err, data) => {
      if (err) {
        res.json(err);
      } else if (data.length) {
        return res.status(409).json({ message: "Email already exists" });
      } else {
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(req.body.clientpassword, salt);
        const sql = "INSERT INTO clientlogindetails (clientemail, clientpassword) VALUES (?)";
        const values = [req.body.clientemail, hashedpassword];

        db.query(sql, [values], (err) => {
          if (err) {
            res.json(err);
          } else {
            res.status(201).json({ message: "Client signup successful" });
          }
        });
      }
    });
  } catch (err) {
    res.json(err);
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const query = 'SELECT * FROM your_table';
    const result = db.query(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data from the database.' });
  }
});

app.post('/addinclientpersonaldetails', async (req, res) => {
  try {
    const sql = "INSERT INTO clientpersonaldetails (clientname, clientgender, clientnumber, clientlifestyle, clientoccupation, DOB, clientemail) VALUES (?)";
    const values = [
      req.body.clientname,
      req.body.clientgender,
      req.body.clientnumber,
      req.body.clientlifestyle,
      req.body.clientoccupation,
      req.body.DOB,
      req.body.clientemail
    ];

    db.query(sql, [values], (err) => {
      if (err) {
        res.json(err);
      } else {
        res.status(201).json({ message: "Client signup successful" });
      }
    });
  } catch (err) {
    res.json(err);
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
          const hashedpassword = await bcrypt.hash(req.body.consultantpassword, salt);
          console.log(hashedpassword)
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

  
//CLIENT LOGIN  
app.post('/login', (req, res) => { 
  const query = "SELECT clientlogindetails.clientemail, clientlogindetails.clientpassword, clientpersonaldetails.clientname FROM clientlogindetails INNER JOIN clientpersonaldetails ON clientlogindetails.clientemail = clientpersonaldetails.clientemail;";
  const email = req.body.clientemail;
  const password = req.body.clientpassword;
  try {
      db.query(query, [email], async (err, result) => {
          if (err) {
              res.status(500).send({ err: err });
          } else if (result.length == 0) {
              res.status(401).send("INCORRECT EMAIL OR PASSWORD");
          } else {
              const isPasswordCorrect = await bcrypt.compare(password, result[0].clientpassword);
              console.log(isPasswordCorrect)
              if (!isPasswordCorrect) {
                  res.status(401).send("INCORRECT PASSWORD");
              } else {
                const user = result[0];//
                const accessToken = TokenCreation(user.clientemail, user.clientname);
                res.cookie("accessToken", accessToken, {maxAge: 60 * 60 * 24 * 30 * 1000, httpOnly: true,})
                res.json({
                  accessToken,
                  clientemail: user.clientemail,
                  clientname: user.clientname
                })
              }
          }
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({ error: error });
  }
});

//CONSULTANT LOGIN
app.post('/conlogin', (req, res) => {
  const query = "SELECT * FROM consultantsignup WHERE consultantemail = ?";
  const email = req.body.consultantemail;
  const password = req.body.consultantpassword;
  try {
      db.query(query, [email], async (err, result) => {
          if (err) {
            res.status(500).send({ err: err });
          } else if (result.length == 0) {
              res.status(401).send("INCORRECT EMAIL OR PASSWORD");
          } else {
              const isPasswordCorrect = await bcrypt.compare(password, result[0].consultantpassword);
              console.log(isPasswordCorrect)
              if (!isPasswordCorrect) {
                  res.status(401).send("INCORRECT PASSWORD");
              } else {
                  res.send(result);
                  console.log(result);
              }
          }
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({ error: error });
  }
});

