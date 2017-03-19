var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

// POST to add user
router.post('/adduser', function(req,res){
  var db = req.db;
  var collection = db.get('userlist');
  collection.insert(req.body, function(err,result){
    res.send(
      (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

router.delete('/deleteuser/:id',function(req,res){
  var db = req.db;
  var collection = db.get('userlist');
  var userToDelete = req.params.id;
  collection.remove({ '_id' : userToDelete}, function(err){
    res.send ((err === null) ? {msg: ''} : {msg:'error: ' + err});
  });
});

router.put('/updateuser/:id', function(req,res){
  var db = req.db;
  var collection = db.get('userlist');

  console.log(req.params);

  // Get req body
  var doc = { $set: req.body};

  var userToUpdate = req.params.id;

  collection.updateById(userToUpdate, doc, function(err){
    res.send((err === null) ? {msg : ''} : {msg : 'error' + err});
  });
});

module.exports = router;
