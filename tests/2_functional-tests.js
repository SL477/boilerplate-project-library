/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */
import * as chai from 'chai';
import server from '../server.js';

import mocha from 'mocha';
import chaiHttp from 'chai-http';

const { suite, test } = mocha;
const chaiServer = chai.use(chaiHttp);
const assert = chai.assert;
const { request } = chaiServer;

suite('Functional Tests', function () {
    /*
     * ----[EXAMPLE TEST]----
     * Each test should completely test the response of the API end-point including response status code!
     */
    test('#example Test GET /api/books', function (done) {
        request(server)
            .get('/api/books')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, 'response should be an array');
                assert.property(
                    res.body[0],
                    'commentcount',
                    'Books in array should contain commentcount'
                );
                assert.property(
                    res.body[0],
                    'title',
                    'Books in array should contain title'
                );
                assert.property(
                    res.body[0],
                    '_id',
                    'Books in array should contain _id'
                );
                done();
            });
    });
    /*
     * ----[END of EXAMPLE TEST]----
     */
    var bookid;
    suite('Routing tests', function () {
        suite(
            'POST /api/books with title => create book object/expect book object',
            function () {
                test('Test POST /api/books with title', function (done) {
                    //done();
                    request(server)
                        .post('/api/books')
                        .send({
                            title: 'Test Title',
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.title, 'Test Title');
                            assert.isString(res.body._id);
                            bookid = res.body._id;
                            done();
                        });
                });

                test('Test POST /api/books with no title given', function (done) {
                    //done();
                    request(server)
                        .post('/api/books')
                        .send({
                            title: '',
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.text, 'missing title');
                            //console.log(res.text);
                            done();
                        });
                });
            }
        );

        suite('GET /api/books => array of books', function () {
            test('Test GET /api/books', function (done) {
                request(server)
                    .get('/api/books')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);

                        done();
                    });
                //done();
            });
        });

        suite('GET /api/books/[id] => book object with [id]', function () {
            test('Test GET /api/books/[id] with id not in db', function (done) {
                //done();
                request(server)
                    .get('/api/books/' + 'aaaaaaaaaaaaaaaaaaaaaaaa')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, 'no book exists');
                        done();
                    });
            });

            test('Test GET /api/books/[id] with valid id in db', function (done) {
                //done();
                request(server)
                    .get('/api/books/' + bookid)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        //assert.isArray(res.body);
                        assert.equal(res.body._id, bookid);
                        assert.equal(res.body.title, 'Test Title');
                        assert.isArray(res.body.comments);
                        done();
                    });
            });
        });

        suite(
            'POST /api/books/[id] => add comment/expect book object with id',
            function () {
                test('Test POST /api/books/[id] with comment', function (done) {
                    //done();
                    request(server)
                        .post('/api/books/' + bookid)
                        .send({ Comment: 'Test' })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body._id, bookid);
                            assert.equal(res.body.title, 'Test Title');
                            assert.isArray(res.body.comments);
                            done();
                        });
                });
            }
        );
    });
});
