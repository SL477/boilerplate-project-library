/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

import { Schema, model, connect } from 'mongoose';
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

// schema
const bookSchema = new Schema({
    book_title: { type: String, required: true },
    comments: { type: [String] },
});
const bookObject = model('bookRecord', bookSchema);
const bookRecord = model('bookrecords', bookSchema);
export default function (app) {
    connect(process.env.DB)
        .then(console.log('connected'))
        .catch((ex) => console.error(ex));

    app.route('/api/books')
        .get(function (req, res) {
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

            bookRecord
                .find({ book_title: { $ne: null } })
                .select('_id book_title comments')
                .then((docs) => {
                    // const retArr = [];
                    // docs.forEach(d => {
                    //   retArr.push({
                    //     _id: d._id,
                    //     title: d.book_title,
                    //     commentcount: d.comments == undefined? 0 : d.comments.length
                    //   });
                    // });

                    const retArr = docs.map((d) => {
                        return {
                            _id: d._id,
                            title: d.book_title,
                            commentcount:
                                d.comments == undefined ? 0 : d.comments.length,
                        };
                    });

                    res.send(retArr);
                })
                .catch((err) => {
                    console.error(err);
                    res.send(err);
                });
        })

        .post(function (req, res) {
            var title = req.body.title;
            //response will contain new book object including atleast _id and title
            //console.log('hi ' + title);
            if ((title = '' || !title)) {
                res.send('missing title');
            } else {
                // bookObject.create(
                //     { book_title: req.body.title },
                //     function (err, data) {
                //         if (err) {
                //             console.log(err);
                //             res.send(err);
                //         } else {
                //             res.json({ _id: data._id, title: data.book_title });
                //         }
                //     }
                // );
                bookObject
                    .create({ book_title: req.body.title })
                    .then((data) =>
                        res.json({
                            _id: data._id,
                            title: data.book_title,
                        })
                    )
                    .catch((err) => {
                        console.error(err);
                        res.send(err);
                    });
            }
        })

        .delete(function (req, res) {
            //if successful response will be 'complete delete successful'
            // bookrecord.deleteMany({}, function (err) {
            //     if (err) {
            //         console.log(err);
            //         res.send(err);
            //     } else {
            //         res.send('complete delete successful');
            //     }
            // });
            bookRecord
                .deleteMany({})
                .then(res.send('complete delete successful'))
                .catch((err) => {
                    console.error(err);
                    res.send(err);
                });
        });

    app.route('/api/books/:id')
        .get(function (req, res) {
            //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
            //bookrecord.findOne({'_id': bookid}).select('_id book_title comments').exec(function (err, docs) {
            // bookrecord
            //     .findById({ _id: bookid })
            //     .select('_id book_title comments')
            //     .exec(function (err, docs) {
            //         if (err) {
            //             console.log(err);
            //             res.send(err);
            //         } else {
            //             if (docs) {
            //                 res.json({
            //                     _id: docs._id,
            //                     title: docs.book_title,
            //                     comments: docs.comments,
            //                 });
            //             } else {
            //                 res.send('no book exists');
            //             }
            //         }
            //     });
            bookRecord
                .findById(req.params.id)
                .select('_id book_title comments')
                .then((docs) => {
                    if (docs) {
                        res.json({
                            _id: docs._id,
                            title: docs.book_title,
                            comments: docs.comments,
                        });
                    } else {
                        res.send('no book exists');
                    }
                })
                .catch((err) => res.send(err));
        })

        .post(function (req, res) {
            const bookid = req.params.id;
            const comment = req.body.comment;
            //json res format same as .get
            console.log(bookid);
            try {
                // bookObject.findOneAndUpdate(
                //     { _id: bookid },
                //     { $push: { comments: comment } },
                //     { new: true },
                //     function (err, docs) {
                //         if (err || !docs) {
                //             console.log(err);
                //             res.send('no document to update');
                //         } else {
                //             console.log(docs);
                //             console.log(docs._id);
                //             console.log(docs.book_title);
                //             //console.log(docs.comments);
                //             //res.json({"_id": docs._id, 'title': docs.book_title});
                //             res.json({
                //                 _id: docs._id,
                //                 title: docs.book_title,
                //                 comments: docs.comments,
                //             });
                //         }
                //     }
                bookObject
                    .findOneAndUpdate(
                        { _id: bookid },
                        { $push: { comments: comment } },
                        { new: true }
                    )
                    .then((docs) => {
                        if (docs) {
                            res.json({
                                _id: docs._id,
                                title: docs.book_title,
                                comments: docs.comments,
                            });
                        } else {
                            res.send('no document to update');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send('no document to update');
                    });
            } catch (err) {
                console.log(err);
                res.send(err.message);
            }
        })

        .delete(function (req, res) {
            var bookid = req.params.id;
            //if successful response will be 'delete successful'
            if (bookid == '') {
                res.send('no book exists');
            } else {
                // bookObject.findByIdAndDelete(
                //     { _id: bookid },
                //     function (err, doc) {
                //         if (err || !doc) {
                //             console.log(err);
                //             res.send('no book exists');
                //         } else {
                //             res.send('delete successful');
                //         }
                //     }
                // );
                bookObject
                    .findByIdAndDelete(bookid)
                    .then((doc) => {
                        if (doc) {
                            res.send('delete successful');
                        } else {
                            res.send('no book exists');
                        }
                    })
                    .catch(() => res.send('no book exists'));
            }
        });
}
