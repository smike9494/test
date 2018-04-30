var express = require('express');
var router           = express.Router();

router.get('/us-news', function(req, res) {
    res.send('hello us news');
});

router.get('/worldwide', function(req, res) {
    res.send('hello worldwide');
});

router.get('/economics', function(req, res) {
    res.send('hello economics');
});

router.get('/politics', function(req, res) {
    res.send('hello politics');
});

router.get('/business', function(req, res) {
    res.send('hello business');
});

router.get('/markets', function(req, res) {
    res.send('hello markets');
});

router.get('/tech', function(req, res) {
    res.send('hello tech');
});

router.get('/travel', function(req, res) {
    res.send('hello travel');
});

router.get('/lifestyle', function(req, res) {
    res.send('hello lifestyle');
});

router.get('/sports', function(req, res) {
    res.send('hello sports');
});

router.get('/video', function(req, res) {
    res.send('hello video');
});


module.exports = router;