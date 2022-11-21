var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 res.sendFile(__dirname + '/frontend/index.html'); 
});

/*POST login request*/
router.post('/api/login', async (req, res) => {
    const {username, password} = req.body; 
  
    try {
      const response = await user.findOne({
        username,
        password 
      })
      console.log(response+"this is the response");
      if (response===null){
        console.log('incorrect password');
        return res.status(401).json({message: 'Successful login'}); 
      } else {
        return res.status(200).json({message: 'Successful login'}); 
      }
    } catch (err) {
      console.log(err);
      return res.json({status: 'error', error: 'look at console for error ig'});
    }
  })

module.exports = router;
