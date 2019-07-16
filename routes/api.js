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

module.exports = function (app) {
  Mongoose.connect(process.env.DB, { useNewUrlParser: true }, function (err) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
    }});

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      bookObject.create({'book_title': req.body.title}, function (err, data) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.json({'_id': data._id, 'title': data.book_title});
        }
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
