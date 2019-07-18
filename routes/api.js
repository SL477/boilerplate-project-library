/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
var Mongoose = require('mongoose');
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

//schema
var bookSchema = new Mongoose.Schema({
  book_title: { type: String, required: true },
  comments: { type: [String] }
});
var bookObject = Mongoose.model('bookRecord', bookSchema);
var bookrecord = Mongoose.model('bookrecords', bookSchema);
module.exports = function (app) {
  Mongoose.connect(process.env.DB, { useNewUrlParser: true, useFindAndModify: false }, function (err) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log('db connected');
    }});

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      //bookObject.find({}).exec(function (err, docs) {
        //bookObject.aggregate([{"$group": {'_id': '_id', 'title': 'book_title', "commentcount": {$sum: {$size: "$comments"}}}}]).exec(function (err, docs) {
          /*bookObject.aggregate([
          {'$group': 
            {
              '_id': '$_id',
              'title': '$book_title', 
              'commentcount': {'$sum': {'$size': '$comments'}}
            }},
            {
              '$project': {'book_title': '$bookObject.book_title', '_id': '$bookObject._id', 'comments': '$bookObject.comments'}
            }
          
        ]).exec(function (err, docs) {*/
      bookrecord.find({'book_title': { $ne: null }}).select('_id book_title comments').exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          var retArr = [];
          docs.forEach(function (d){
            var ret = {};
            //console.log(d.book_title);
            ret['_id'] = d._id;
            ret['title'] = d.book_title;
            ret['commentcount'] = d.comments == undefined? '0': d.comments.length;
            retArr.push(ret);
          });
          //console.log(docs);
          //console.log({"_id": docs._id, 'title': docs.book_title, 'commentcount': docs.comments == undefined? '0': docs.comments.length});
          console.log(retArr);
          //res.json({"_id": docs._id, 'title': docs.book_title, 'commentcount': docs.comments == undefined? '0': docs.comments.length});
          res.send(retArr);
          //res.send('hi');
        }
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      //console.log('hi ' + title);
      if (title = '' || !title) {
        res.send('missing title');
      } else {
        bookObject.create({'book_title': req.body.title}, function (err, data) {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.json({'_id': data._id, 'title': data.book_title});
          }
        });
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      bookrecord.deleteMany({}, function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send('complete delete successful');
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      bookrecord.findOne({'_id': bookid}).select('_id book_title comments').exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          
          res.json({"_id": docs._id, 'title': docs.book_title, 'comments': docs.comments });
        }
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      console.log(bookid);
      try{
        bookObject.findOneAndUpdate({_id: bookid},{'$push': {'comments':comment}}, {new:true},function (err, docs) {
          if (err || !docs) {
            console.log(err);
            res.send('no document to update');
          } else {
            console.log(docs);
            console.log(docs._id);
            console.log(docs.book_title);
            //console.log(docs.comments);
            //res.json({"_id": docs._id, 'title': docs.book_title});
            res.json({"_id": docs._id, 'title': docs.book_title, 'comments': docs.comments });
          }
        });
      }
      catch (err){
        console.log(err);
        res.send(err.message);
      }
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (bookid == '') {
        res.send('no book exists');
      } else {
        bookObject.findByIdAndDelete({'_id': bookid}, function (err, doc) {
          if (err || !doc) {
            console.log(err);
            res.send('no book exists');
          } else {
            res.send('delete successful');
          }
        });
      }
    });
  
};
