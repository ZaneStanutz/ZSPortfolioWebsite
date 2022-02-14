var express = require('express');
var router = express.Router();
var nodeMailer = require('nodemailer');
var ssn;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Home' });
});
router.post('/', function(req, res, next){
  ssn = req.session;
  var date = new Date();
  ssn.email = req.body.contactEmail;
  ssn.fname = req.body.firstName;
  ssn.message = req.body.contactMessage;
  ssn.ischecked = req.body.isChecked;
  ssn.datesent = date;
  var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'zz.on.a.wav@gmail.com',
      pass: 'Agqf9Kfki8szBwB'
    }
  });

  var mailOptions = {
    from: 'zz.on.a.wav@gmail.com',
    to: 'stanutz.stanutz@gmail.com',
    subject: 'Dev portfolio message from: ' + ssn.email + '(' + ssn.fname +')',
    text: 'Message:\n\n' + ssn.message
  };
  
  transporter.sendMail(mailOptions, function(err,info){
    if(err){
      console.log(err);
      res.render('whoops', 
      {whoops: "Something Exploded sending email...Please double check email."});
    }
    console.log(info + "THIS IS SMTP MAIL INFO");
  }); //transporter.sendMail()
  res.redirect(307,'thanks');
});
module.exports = router;
