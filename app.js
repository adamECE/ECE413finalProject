/* 
  Installed body-parser, mongoose, generate-api-key
  npm install dotenv --save
  npm i jsonwebtoken bcryptjs
  npm i cookie-parser
*/

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const PORT = 5500; 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();



mongoose.connect(process.env.MONGODB_CONNECT).then(() => console.log("connected to mongodb server")
).catch((err) => console.log("error connecting to cluster: " + err)); 

//const indexRouter = require('./routes/index');

const user = require('./routes/users');
const apiKeys = require('./routes/apiKey');
//const hrdata = require('./routes/heartRateData')

const mainRouter = require('./routes/router');
const { kStringMaxLength } = require('buffer');
const { time } = require('console');
const { stringify } = require('querystring');

const app = express();
app.use(cookieParser()); 

app.use('/', express.static(path.join(__dirname, 'public/frontend')));
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  //console.log(req.body);
  const {username, password} = req.body; 

  try {
    const response = await user.findOne({
      username
    })
    console.log(response);
    if (response==null){
      return res.status(401).json({message: 'Unsuccessful login'}); 
    } else {
      const passwordMatches = await bcrypt.compare(password,response.password);
      if(!passwordMatches){
        return res.json({message:'Wrong credentials pass'});
      }
      const token = await jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      
      return res.cookie({"token":token}).json({success:true,message:'LoggedIn Successfully'})
      //return res.status(200).json({message: 'Successful login'}); 
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({message: 'Unsuccessful login, look at console for error'}); 
  }
})
 
app.post('/api/register/', async (req, res) => {
  console.log(req.body);
  console.log("apiKey: " + req.params.apiKey); 
  
  const {username, password, deviceKey} = req.body; 
  const heartRates = []; 
  const apiKey = process.env.MAIN_KEY;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    const response = await user.create({
      username, 
      password, 
      deviceKey,
      apiKey, 
      heartRates 
    })
    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
  });
  } catch (err) {
    if (err.code === 11000){
      return res.json({status: 'error', error: 'Username already in use'});
    }
    throw err; 
  }

  res.json({ status:'ok' })
})

app.post('/api/sendHeartRates/', async (req, res) => {
  const {deviceKey, time, heartRate, satOxygen, username} = req.body;
  console.log(typeof(deviceKey))
  if (apiKeys.includes(req.query.apiKey)){
    try {
      const response = await user.findOne({deviceKey});
      
      console.log(response); 
      const toUpdate = await user.findByIdAndUpdate(
        response._id, 
        {
          "$push": {"heartRates": {
            time: time, 
            heartRate: heartRate,
            satOxygen: satOxygen
          }
        }
        }); 
    } catch (err) {
      console.log(err);
      return res.json({status: 'error', error: err});
    }
  }
  res.json({ status:'ok' })
})

app.get('/api/getUserHeartRateData', async (req, res) => { 
  const username = req.query.username
  let hrObj = null; 
  const response = user.findOne({ username }, function(err, userObj) {
    if(err) {
      return res.json({status: 'Error', error: err}); 
    } else if (userObj) {
      hrObj = userObj; 
      return res.send(hrObj);
    } else {
      console.log("User Error: " + err); 
    }
  });
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})

module.exports = app;
