var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient; // is property;
var cs = 'mongodb+srv://zaneStanutz:MMX2Unrs5qSA4Pu@cluster0.gyh41.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
var ssn;

var statusHappy = 'Thanks for adding your email. I appreciate you!';
var statusSad = 'I know subscribing to another mailing list is a big ask theses days..';


router.get('/', function(req, res, next){
  console.log('bypass success..');
  res.redirect('home');
}); // router.get()
router.post('/', function(req,res){
  ssn = req.session;

  MongoClient.connect(cs, function(errdb,db){
    if(errdb){
      console.log('connection to db failed');
      console.log(errdb);
    }
    else{
      var database = db.db('PortfolioDb');
      var userMsg = {
        email: ssn.email,
        firstName: ssn.fname,
        message: ssn.message,
        date: ssn.datesent
      };
      database.collection('emails').insertOne(userMsg, function(errtwo, resInsert){
        if(errtwo){
          console.log('insert one to emails failed');
          console.log(errtwo);
        }
        console.log( 'emails insert one: '+ resInsert.acknowledged);
      }); // insertOne to emails.
    } // mongoclient else
    if(ssn.ischecked){
      var query = {email: ssn.email};
      database.collection('mailinglist').find(query).toArray(function(errmailing,resmailing){
        if(errmailing){
          console.log('error With find');
          conslole.log(errmailing);
        }
        console.log(resmailing);
        console.log( 'Length of find: ' + resmailing.length);
        if(resmailing.length == 0){
          var insertEmail = {
            firstname: ssn.fname,
            email: ssn.email,
            datejoined: ssn.datesent,
          };
          database.collection('mailinglist').insertOne(insertEmail, 
          function(errlist, reslist){
          if(errlist){
            console.log("error with contactlist addOne");
            console.log(errlist);
          }
          console.log(reslist);
          });// insert one email
          console.log('email added to mailing list db'); 
          //redirect?
        } // if resmailing ==0
        else{
          console.log("email already in userdb");
          //redirect?
        }
      });//find
      console.log('reward');
      res.render('thanks', {title:'Thanks',fname: ssn.fname, ischecked: ssn.ischecked, status: statusHappy });
    } // if ssn.ischecked
    else{
      //scold user
      console.log('scold');
      res.render('thanks', {title:'Thanks',fname: ssn.fname, ischecked: ssn.ischecked,  status: statusSad });
      //redirect?
    }
  });// MongoCLient()
  req.session.destroy()
}); // POST

module.exports = router;


