const {sign, verify} = require('jsonwebtoken');

const TokenCreation = (clientemail,clientname) => {
  const payload = sign({
    email: clientemail,
    name: clientname
  },"your_secret_key")

  return payload;
}

const validatetoken = (req,res,next) => {
  const Token = req.cookies["accessToken"]
  if(!Token){
    return res.status(400).json({error: "User not authenticated!"});
  }
  try{
    const validToken = verify(Token,"your_secret_key")
    if(validToken){
      req.authenticated = true
      return next()
    }
  }catch(err){
    return res.status(400).json({err:err})
  }

  }

module.exports = { TokenCreation , validatetoken};