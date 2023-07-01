const express = require('express'); //dont convert to ES6
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const {TokenCreation,validatetoken} = require('./JWTutility');
const cookieParser = require('cookie-parser');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const stripe = require('stripe')('sk_test_51N6ORnEisZGzLMpF3GPwu8Jb9hfgdciFRfhq3xMpjD5qfxYqpYUrRNokPy7HNdObu9lnDaV4ZexOXkW54utdhn0h00pkRiOszm')

app.use(cors());
app.use(cookieParser());
 
//--------------------WEBHOOK SECTION/--------------------/////////////////////////////////

let endpointSecret = "whsec_8iO25pWa3GH2hntJCBKAZg1C9uEzBeJy"
// Assuming you have a route to handle successful payments
app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object; 
      const userEmail = checkoutSessionCompleted.metadata.userEmail
      const policyId = checkoutSessionCompleted.metadata.policyId 
      const policyActive = checkoutSessionCompleted.metadata.policyActive
      const NRIC = checkoutSessionCompleted.metadata.NRIC
      let sqlCheckNRIC = 'SELECT NRICnumber FROM clientboughtpolicies WHERE clientemail = ?';
      db.query(sqlCheckNRIC, [userEmail], (err, result) => {
          if (err) {
              response.status(500).json({ message: "Internal server error", error: err });
          } else {
               if (result[0].NRICnumber == null) {
                  let sqlUpdatePolicy = `UPDATE clientboughtpolicies SET policyid${policyId} = ?, NRICnumber = ? WHERE clientemail = ?`;
                  db.query(sqlUpdatePolicy, [policyActive, NRIC, userEmail], (err, result) => {
                      if (err) {
                          response.status(500).json({ message: "Internal server error", error: err });
                      }else{

                      }
                  });
              } else {
                  let sqlUpdatePolicy = `UPDATE clientboughtpolicies SET policyid${policyId} = ? WHERE clientemail = ?`;
                  db.query(sqlUpdatePolicy, [policyActive, userEmail], (err, result) => {
                      if (err) {
                          response.status(500).json({ message: "Internal server error", error: err });
                      } else {
                        db.query(sqlUpdatePolicy, [policyActive, NRIC, userEmail], (err, result) => {
                          if (err) {
                              response.status(500).json({ message: "Internal server error", error: err });
                          }
                      }); 
                    }
                  });
              }
          }
        })
       break;
    default:
      console.log(`Unhandled event type ${event.type}`);
   }
 });
//--------------------WEBHOOK SECTION/--------------------/////////////////////////////////

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

app.post('/checkClients', async (req, res) => {
  const consultantEmail = req.body.consultantEmail;
  const sql = `SELECT * FROM claimtable WHERE consultantemail = ?`;
  try {
    db.query(sql, [consultantEmail], (err, results) => {
      if (err) {
        res.status(500).json(err);
      } else if(results.length === 0){
        res.status(201).json({ NoClientsClaimMsg: "no client claims yet" });
      } else {
          const serverStoreClient = []
          for (let i = 0; i < results.length; i++) {
             let dateTime = new Date(results[i]['dateandtimecreated']);
             let ClaimSubmitDate = new Date(results[i]['claimdate']);
             let dateOnly = dateTime.toLocaleDateString();
             let dateOnlyClaim = ClaimSubmitDate.toLocaleDateString();
              ClientClaimsList = {
                Claimid: results[i].claimid,
                ClaimStatus: results[i].claimstatus,
                ClaimDate: dateOnlyClaim,
                ClaimImage: results[i].claimimage,
                ImageFormat: results[i].imageformat,
                ClaimAmount: results[i].claimamount,
                PolicyId: results[i].policyid,
                ClientEmail: results[i].clientemail,
                ClientName: results[i].clientname,
                DateCreated: dateOnly
              } 
            serverStoreClient.push(ClientClaimsList)
          }
           res.status(200).json(serverStoreClient);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

///change
app.post('/ChangeClaimStatus', async (req, res) => {
  const { claimId, clientEmail, consultantEmail, status } = req.body;

  try {
    const query = `SELECT * FROM claimtable WHERE claimid = ? AND consultantemail = ? AND clientemail = ?`;
    db.query(query, [claimId, consultantEmail, clientEmail], (err, results) => {
      if (err) {
        console.error("First block error:", err);
        return res.status(500).send({ message: "Internal server error" });
      } 
      if (results.length === 0) {
        return res.status(404).send({ message: "No claim found with provided information." });
      }
      const queryUpdate = `UPDATE claimtable SET claimstatus = ? WHERE claimId = ? AND consultantemail = ? AND clientemail = ?`;
      db.query(queryUpdate, [status, claimId, consultantEmail, clientEmail], (err, results) => {
        if (err) {
          console.error("Second block error:", err);
          return res.status(500).send({ message: "Internal server error during update" });
        }
        return res.status(200).send({ message: "Claim status updated successfully" }); 
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send({ message: "Unexpected internal server error" });
  }
});








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
  try {
    const values = [req.body.policy1details[0].id, req.body.policy1details[0].name, req.body.policy1details[0].price];
    console.log("policy1details values",values)
    const sql = 'SELECT * FROM policiescreation WHERE policyid = ? AND policyname = ? AND pricemonthly = ?';
    
    db.query(sql, values, async (err, result) => {
      if(err){
        console.log("Server issue:", err.message);  
        res.status(500).json({ error: err.message });
      }else if(result.length === 0){
        console.log("Policy not found");
        return res.status(404).json({ message1: "Policy not found" }); 
      }else{        
        const NRICdetails = {
          sessionEmail: req.body.policyDetails.sessionEmail,
          NRIC: req.body.policyDetails.NRIC,
          policyid: req.body.policyDetails.policyid,
          policyActive: req.body.policyDetails.policyActive
        }
         const policyColumn = `policyid${NRICdetails.policyid}`;
        const sqlCheckNull = `SELECT * FROM clientboughtpolicies WHERE clientemail = ? AND NRICnumber IS NULL`
        db.query(sqlCheckNull, [NRICdetails.sessionEmail], async (err, result) => {
          if(err){
            console.log('Error querying for policy:', err);
          }else if(result.length === 0){
            const sqlCheckNRIC = `SELECT NRICnumber FROM clientboughtpolicies WHERE clientemail = ? AND ${policyColumn} IS NOT NULL`;
            console.log(result[0])
            db.query(sqlCheckNRIC, [NRICdetails.sessionEmail, NRICdetails.NRIC], async (err, result) => {
              if(err){
                console.log('Error querying for policy:', err);
              }else if(result.length === 1){
                return res.status(404).json({ userAlrdSignUp: "You are only able to purchase this policy only once." });
              }else{
                const sqlcheckLast = `SELECT NRICnumber FROM clientboughtpolicies WHERE clientemail = ?`
                db.query(sqlcheckLast, [NRICdetails.sessionEmail], async (err, result) => {
                  if(err){
                    console.log('Error querying for policy:', err);
                  }else if(NRICdetails.NRIC !== result[0].NRICnumber){
                    res.status(400).json({ incorrectNRIC: "Please input your designated NRIC for this account to purchase this policy."});
                  }else{
                    const session = await createStripeSession(req);
                    res.json({ url: session.url });
                  }
                }) 
              }
            }); 
          }else{
            const session = await createStripeSession(req);
            res.json({ url: session.url });
          }
        });
      }
    });
  }catch(e) {
    console.log('Error in /checkout-session:', e);
    res.status(500).json({ error: e.message });
  }
});


async function createStripeSession(req) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: 'http://localhost:3000/paymentSuccess', 
    cancel_url: 'http://localhost:3000/paymentErr',
    line_items: [{
      price_data: {
        currency: 'sgd',
        product_data: {
          name:req.body.policy1details[0].name
        },
        unit_amount: req.body.policy1details[0].price * 100,
      },
      adjustable_quantity: {
        enabled: false
      },
      quantity: 1,
    }],
    metadata: {
      userEmail: req.body.policyDetails.sessionEmail,
      policyId: req.body.policyDetails.policyid,
      policyActive: req.body.policyDetails.policyActive,
      NRIC: req.body.policyDetails.NRIC
     }, 
  });
 }

app.post('/showPurchasePolicies', async (req, res) => {
  try {
    const query = `SELECT ${Array.from({ length: 10 }, (_, i) => `policyid${i + 1}`).join(', ')} FROM clientboughtpolicies WHERE clientemail = ?`;
    const sessionEmail = req.body.payload.sessionEmail
     db.query(query,sessionEmail, (err, results) => {
      if (err) {
        return res.status(500).json({errMessage: "Database query error"});
      } else {
        // Initialize the activePoliciesObject
        let activePoliciesObject = {}

        // If there's at least one result, process it
        if(results.length>0) {
          for(let i = 1; i <= 10; i++){
            const policyId = `policyid${i}`;
             if (results[0][policyId]) {
              activePoliciesObject[policyId] = results[0][policyId];
            }
          }
         }
         // Return the activePoliciesObject as the JSON response
        return res.status(201).json(activePoliciesObject);
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({errMessage: "Internal server error"});
  }
});


app.get('/displayConsultants', async (req, res) => {
  try {
    const query = `SELECT consultantid, consultantemail, consultantname, consultantnumber, consultantgender, hearfromus FROM consultantpersonaldetails`;
    db.query(query, (err, results) => {
      if (err) {
        console.log({"first block err": err});
        return res.status(500).json({ errMessage: "Internal server error" });
      }
      const consultantDetails = {};
      for (let i = 0; i < results.length; i++) {
        const consultant = results[i];
        const consultantId = consultant.consultantid; 

        consultantDetails[consultantId] = {
          consultantname: consultant.consultantname,
          consultantemail: consultant.consultantemail,
          consultantnumber: consultant.consultantnumber,
          consultantgender: consultant.consultantgender,
          hearfromus: consultant.hearfromus
        };
      }      
      return res.status(200).json(consultantDetails);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errMessage: "Internal server error" });
  }
});

app.post('/postSelectConsultant', async (req, res) => {
  const ClientEmail = req.body.PayloadClientEmail
  const ConsultantEmail = req.body.PayloadConsultantEmail
  const ClientName = req.body.PayloadClientName
  try {
      const query = 'INSERT INTO claimtable (clientemail,clientname, consultantemail) VALUES (?, ?,?)';
       db.query(query, [ClientEmail,ClientName, ConsultantEmail], (err, results) => {
          if (err) {
            console.error(err);
            res.status(500).send('MySQL error: ${err.message}');
          } else {
          res.status(200).send('Data inserted successfully');
        }
      });
    }catch(err){

  }
});

app.post('/checkSelectedConsultant', async (req, res) => {
  const ClientEmail = req.body.clientEmail;
  try {
    const query = `SELECT consultantemail FROM claimtable WHERE clientemail = ?`;
    db.query(query, [ClientEmail], (err, results) => {
      if (err) {
        console.log({"first block err": err});
        return res.status(500).json({ errMessage: "Internal server error" });
      } else if (results[0]) {
        const ConEmail = results[0].consultantemail
         const queryfind = `SELECT consultantid,consultantemail, consultantname, consultantnumber, consultantgender, hearfromus FROM consultantpersonaldetails WHERE consultantemail = ?`
         db.query(queryfind, [ConEmail], (err, results) => {
          if(err){
            console.log({"first block err": err});
            return res.status(500).json({ errMessage: "Internal server error" });
          }else{
            const consultantData = results[0];
             return res.status(201).json(consultantData);          
          }
         })
      } else {
        // Handle the case when there are no results
        res.status(404).json({ message: "No consultant found for this client email." });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errMessage: "Internal server error" });
  }
});

app.post('/Claims', upload.fields([{ name: 'policyImg', maxCount: 1 }]), (req, res) => {
  const {
    policyidDate,
    policyidAmt,
    policyidImgType,
    sessionEmail,
    sessionConEmail,
    sessionClientName,
    policyid,
  } = req.body;
   const policyImg = req.files['policyImg'] ? req.files['policyImg'][0] : null;

  // Check if client has a consultant
  db.query('SELECT * FROM claimtable WHERE clientemail = ?', sessionEmail, (err, consultantCheck) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ errMessage: "Internal server error" });
    }
    if (consultantCheck.length === 0) {
       return res.json({ NoConsultantMsg: "Pick a consultant at the homepage before making a claim" });

    } else {
      const imageBuffer = policyImg ? policyImg.buffer : null;
      const checkquery = `SELECT * FROM claimtable WHERE claimdate IS NOT NULL AND clientemail = ? AND consultantemail = ?`;
      db.query(checkquery, [sessionEmail, sessionConEmail], (err, results) => {
        if (err) {
          console.log({"first block err": err});
          return res.status(500).json({Err: "error" });
        } else if (results.length === 0) { 
          const UpdateQuery = `UPDATE claimtable SET claimdate = ?, claimimage = ?, imageformat = ?, claimamount = ?, policyid = ? WHERE clientemail = ? AND consultantemail = ?`;
          db.query(UpdateQuery, [policyidDate, imageBuffer, policyidImgType, policyidAmt, policyid, sessionEmail, sessionConEmail], (err, results) => {
            if (err) {
              console.log({"second block err": err});
              return res.status(500).json({Err: "error" });
            } else {
              console.log({"successfully went in": results});
              return res.status(201).json({success: "Claim successfully submitted" });
            }
          });
        } else{
          const InsertQuery = `INSERT INTO claimtable (claimdate, claimimage, imageformat, claimamount, policyid, clientemail, clientname, consultantemail) VALUES (?,?, ?, ?, ?, ?, ?, ?)`;
          db.query(InsertQuery, [policyidDate, imageBuffer, policyidImgType, policyidAmt, policyid, sessionEmail, sessionClientName, sessionConEmail], (err, results) => {
            if (err) {
              console.log({"third block err": err});
              return res.status(500).json({Err: "error" });
            } else{
              return res.status(201).json({success: "Successfully block 2" });
            }
          });
        }
      });
    }
  });
});


app.post('/fetchClaimStatus', async (req, res) => {
  const ClientEmail = req.body.sessionEmail;
  try {
    const query = `SELECT * FROM claimtable WHERE clientemail = ? AND ClaimDate IS NOT NULL`;
    db.query(query, [ClientEmail], (err, results) => {
        if (err) {
          console.log({"first block err": err});
          return res.status(500).json({ errMessage: "Internal server error" });
        } else {
          console.log(results)
          return res.status(201).json(results);
        }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errMessage: "Internal server error" });
  }
});

