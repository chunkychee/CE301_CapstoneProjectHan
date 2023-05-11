const express = require('express'); //dont convert to ES6
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const {TokenCreation,validatetoken} = require('./JWTutility');
const cookieParser = require('cookie-parser');
const{default:axios}=require("axios")

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const stripe = require('stripe')('sk_test_51N6ORnEisZGzLMpF3GPwu8Jb9hfgdciFRfhq3xMpjD5qfxYqpYUrRNokPy7HNdObu9lnDaV4ZexOXkW54utdhn0h00pkRiOszm')

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
//--------------------CHAT SECTION/--------------------/////////////////////////////////
 
 
//--------------------ADMIN BACKEND SECTION/--------------------/////////////////////////////////

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

app.get('/policesData', async (req, res) => {
  try {
    const query = "SELECT policyimage, imageformat, policyname, policydescription, policycoverage, pricemonthly FROM policiescreation WHERE policyid >= 1 AND policyid <= 12";
    db.query(query, (error, results) => {
      if (error) {
        throw error;
      }
      const policy1details = results.map(result => ({
        policyname: result.policyname,
        imageformat: result.imageformat,
        policyimage: result.policyimage,
        policydescription: result.policydescription,
        policycoverage: result.policycoverage,
        pricemonthly: result.pricemonthly
      }));
      // Iterate over policy1details array and log each object
      // Return the array of policy names as the JSON response
      res.status(200).json(policy1details);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/changeBuyPolicies', upload.fields([{ name: 'policyImage1', maxCount: 1 }, { name: 'policyImage2', maxCount: 1 }, { name: 'policyImage3', maxCount: 1 }, { name: 'policyImage4', maxCount: 1 }, { name: 'policyImage5', maxCount: 1 }, { name: 'policyImage6', maxCount: 1 }, { name: 'policyImage7', maxCount: 1 }, { name: 'policyImage8', maxCount: 1 }, { name: 'policyImage9', maxCount: 1 }, { name: 'policyImage10', maxCount: 1 }, { name: 'policyImage11', maxCount: 1 }, { name: 'policyImage12', maxCount: 1 }]), async (req, res) => {
  try {
    const numberOfPolicies = 12;
    let query = 'UPDATE policiescreation SET policyimage = ?, imageformat = ?, policydescription = ?, policycoverage = ?, pricemonthly = ? WHERE policyid = ?';
    let promises = [];
    for (let i = 1; i <= numberOfPolicies; i++) {
      const policyImage = req.files[`policyImage${i}`] ? req.files[`policyImage${i}`][0] : null;
      const imageformat = req.body[`imageformat${i}`];
      const policyDescription = req.body[`policyDescription${i}`];
      const policyCoverage = req.body[`policyCoverage${i}`];
      const policyPrice = req.body[`policyPrice${i}`];
 
      if (policyImage || imageformat || policyDescription ||policyCoverage|| policyPrice) {
        promises.push(new Promise((resolve, reject) => {
          const imageBuffer = policyImage ? policyImage.buffer : null;
          db.query(query, [imageBuffer, imageformat, policyDescription, policyCoverage, policyPrice, i], (error, result) => {
            if (error) {
               reject(error);
            } else {
               resolve(result);
            }
          });
        }));
      }
    }
     Promise.all(promises).then(() => {
       res.json({ success: true });
     }).catch((error) => {
      console.log('Promise error:', error);
      res.json(error);
    });
  } catch (error) {
    console.log('General error:', error);
    res.json(error);
  }
});

//--------------------CONSULTANT BACKEND SECTION/--------------------/////////////////////////////////
//add into consultantlogindetails table
  app.post('/consultantlogindetails', async (req, res) => {
    try {
      const query = "SELECT * FROM consultantlogindetails WHERE consultantemail = ?";
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
          const sql = "INSERT INTO consultantlogindetails (consultantemail,consultantpassword) VALUES (?)";
        const values = 
        [req.body.consultantemail,hashedpassword];
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

//add into consultantpersonaldetails table
app.post('/consultantpersonaldetails', async (req, res) => {
  try {
    const sql = "INSERT INTO consultantpersonaldetails (consultantemail, consultantname, consultantnumber, consultantgender, DOB, hearfromus) VALUES (?)";
    const values = [      
      req.body.consultantemail,
      req.body.consultantname,
      req.body.consultantnumber,
      req.body.consultantgender,
      req.body.DOB,
      req.body.hearfromus,
    ];
    db.query(sql, [values], (err) => {
      if (err) {
        res.json(err);
      } else {
        res.status(201).json({ message: "consultant signup successful" });
      }
    });
  } catch (err) {
    res.json(err);
  }
});

//CONSULTANT LOGIN
try {
  app.post('/conlogin', (req, res) => {
    const email = req.body.consultantemail;
    const password = req.body.consultantpassword;
    const query = "SELECT consultantlogindetails.consultantemail, consultantlogindetails.consultantpassword, consultantpersonaldetails.consultantname FROM consultantlogindetails INNER JOIN consultantpersonaldetails ON consultantlogindetails.consultantemail = consultantpersonaldetails.consultantemail WHERE consultantlogindetails.consultantemail = ?"
    db.query(query, [email], async (err, result) => {
      if (err) {
        res.status(500).send({ err: err });
      } else if (result.length == 0) {
        res.status(401).send('INCORRECT EMAIL OR PASSWORD');
      } else {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          result[0].consultantpassword,
        );
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) {
          res.status(401).send('INCORRECT PASSWORD');
        } else {
          const user = result[0];
          const accessToken = TokenCreation(user.consultantemail);
          res.cookie('accessToken', accessToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000,
            httpOnly: true,
          });
          // Return JSON with accessToken and clientemail
          res.json({
            accessToken,
            consultantemail: user.consultantemail,
            consultantname: user.consultantname
          });
        }
      }
    });
  });
} catch (error) {
  console.log(error);
  res.status(500).send({ error: error });
}

//--------------------CLIENT BACKEND SECTION/--------------------/////////////////////////////////
//CLIENT LOGIN  
app.post('/login', async (req, res) => {
  const email = req.body.clientemail;
  const name = req.body.clientname;
  const password = req.body.clientpassword;
  try {
    const query = "SELECT clientlogindetails.clientemail, clientlogindetails.clientpassword, clientpersonaldetails.clientname FROM clientlogindetails INNER JOIN clientpersonaldetails ON clientlogindetails.clientemail = clientpersonaldetails.clientemail WHERE clientlogindetails.clientemail = ?"
    db.query(query, [email], async (err, result) => {
      if (err) {
        res.status(500).send({ err: err });
      } else if (result.length == 0) {
        res.status(401).send('INCORRECT EMAIL OR PASSWORD');
      } else {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          result[0].clientpassword,
        );
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) {
          res.status(401).send('INCORRECT PASSWORD');
        } else {
          const user = result[0];
          const accessToken = TokenCreation(user.clientemail);
          res.cookie('accessToken', accessToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000,
            httpOnly: true,
          });
          // Return JSON with accessToken and clientemail
          res.json({
            accessToken,
            clientemail: user.clientemail,
            clientname: user.clientname
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
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
app.post('/NRICpolicies', async (req, res) => {
  try {
    const NRICdetails = {
      sessionEmail: req.body.sessionEmail,
      NRIC: req.body.NRIC,
      policyid: req.body.policyid,
      policyActive:req.body.policyActive
    };       
    let policyColumn = `policyid${NRICdetails.policyid}`;
    const sqlSearchEmail = "SELECT * FROM clientboughtpolicies WHERE clientemail = ?";
    db.query(sqlSearchEmail, [NRICdetails.sessionEmail], async (err, result) => {
      if (err) {
        res.status(500).json({ message: "Internal server error", error: err });
      } else if (result.length === 0) {
        // If user is not present, return an error
        res.status(404).json({ message: "Client email not found" });
      } else {
        // If user is present, check if the policy is already applied
        let sqlSearchPolicy = `SELECT * FROM clientboughtpolicies WHERE clientemail = ? AND ${policyColumn} IS NOT NULL`;
        db.query(sqlSearchPolicy, [NRICdetails.sessionEmail], (err, result) => {
          if (err) {
            res.status(500).json({ message: "Internal server error", error: err });
          } else if (result.length !== 0) {
            res.status(500).json({ message: "Policy has already been signed up this user" }); 
          } else { 
            // Check if NRIC exists for the user
            const sqlCheckNRIC = "SELECT NRICnumber FROM clientboughtpolicies WHERE clientemail = ? AND NRICnumber IS NOT NULL";
            db.query(sqlCheckNRIC, [NRICdetails.sessionEmail], (err, result) => {
              if (err) {
                res.status(500).json({ message: "Internal server error", error: err });
              } else if (result.length === 0) {
                // If NRIC doesn't exist, insert NRIC and set policy to active
                let sqlUpdatePolicy = `UPDATE clientboughtpolicies SET ${policyColumn} = ?, NRICnumber = ? WHERE clientemail = ?`;
                db.query(sqlUpdatePolicy, [NRICdetails.policyActive, NRICdetails.NRIC, NRICdetails.sessionEmail], (err, result) => {
                  if (err) {
                    res.status(500).json({ message: "Internal server error", error: err });
                  } else {
                    res.status({ message: "NRIC inserted and policy signed up successfully" });
                  }
                });
              } else {
                // If NRIC exists, just set the policy to active
                let sqlUpdatePolicy = `UPDATE clientboughtpolicies SET ${policyColumn} = ? WHERE clientemail = ?`;
                db.query(sqlUpdatePolicy, [NRICdetails.policyActive, NRICdetails.sessionEmail], (err, result) => {
                  if (err) {
                    res.status(500).json({ message: "Internal server error", error: err });
                  } else {
                    res.status(201).json({ message: "Policy signed up successfully" });
                  }
                });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});
    
app.post('/addinclientboughtpolicies', async (req, res) => {
  try {
    const sql = "INSERT INTO clientboughtpolicies(clientemail) VALUES (?)";
    const values = [
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
})
 
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

app.post('/checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
     Payment_method_types:[card],
     mode: 'payment',
     line_items: req.body.items.map(item=>{
       const storeItem = storeItem.get(item.id)
       return{
        price_data:{
          currency:'sgd',
          product_data:{
            name:storeItem.name
          },
          unit_amount: storeItem.priceInCents
        },
        quantity: item.quantity

       }
     }),
     success_url: 'http://localhost:3004/submitted',
     cancel_url: 'http://localhost:3004/policy1',
  });

 });

 