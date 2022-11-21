/* 
  Installed body-parser, mongoose
*/

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const PORT = 5500; 
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ahoffmei:fakePassword@ece413cluster.fetwdvy.mongodb.net/ece413final?retryWrites=true&w=majority').then(() => console.log("connected to mongodb server")
).catch((err) => console.log("error connecting to cluster: " + err)); 

//const indexRouter = require('./routes/index');

const user = require('./routes/users');
const mainRouter = require('./routes/router');


const UserSchema = new mongoose.Schema({
  username: String,
  password: String
})

//const user = mongoose.model("User", UserSchema, "users");

user.findOne({username:"hi"}, (err, foundItem) => {
  if(err){
    console.log("Error:")
    console.log(err);
  } else {
    console.log("Item found: "+foundItem);
  }
})

const app = express();

app.use('/', express.static(path.join(__dirname, 'public/frontend')));
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  //console.log(req.body);
  const {username, password} = req.body; 

  try {
    const response = await user.findOne({
      username,
      password 
    })
    console.log(response);
    if (response==null){
      return res.status(401).json({message: 'Unsuccessful login'}); 
    } else {
      return res.status(200).json({message: 'Successful login'}); 
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({message: 'Unsuccessful login, look at console for error'}); 
  }
})
 
app.post('/api/register', async (req, res) => {
  console.log(req.body); 
  const {username, password, deviceKey} = req.body; 

  try {
    const response = await user.create({
      username, 
      password, 
      deviceKey
    })
  } catch (err) {
    if (err.code === 11000){
      return res.json({status: 'error', error: 'Username already in use'});
    }
    throw err; 
  }

  res.json({ status:'ok' })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})

module.exports = app;
