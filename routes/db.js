var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');
var YFhistoricaldata = require('../queries/historicaldata.js');
var mongoose = require('mongoose');

var db = mongoose.connection;
var host = process.env["DB_HOST"]
if (!host) host = "mongodb://localhost/hufter";
    
var tickers = require('../db/query-mongo.js');
var getTickers = tickers.getTickers;
var saveToMongo = require('../db/save-mongo.js');
var saveHistToMongo = require('../db/save-hist-mongo.js');

router.use('*', function(req, res, next){
  if (db.readyState === 0) {
    Promise.resolve(mongoose.connect(host)).then(next());
  } else {
    next();
  }
});

router.get('/save', function(req, res, next) {
  console.log("Saving...");

  getTickers()
	.then((tickers) => YFquotes.getLastTrade(tickers))
	.then((response) => saveToMongo.save(response))
	.then((saveStatuses, err) => res.end(err || saveStatuses))
});

router.get('/save/historical', function(req, res, next) {
    getTickers()
	.then((tickers) => YFhistoricaldata.getAllData(symbols, req.query.startDate, req.query.endDate))
	.then((response) => saveHistToMongo.save(response))
	.then((saveStatuses, err) => res.end(err || saveStatuses))
});
	  
router.get('/load/historical', function(req, res, next) {
    getTickers()
	.then((tickers) => saveHistToMongo.load(symbols))
	.then((response) => res.end(response))
});

		      
router.get('/tickers', function(req, res, next){
  getTickers().then((symbols) => res.end(symbols.join(", ")))
})
	   
router.get('/tickers/:ticker', function(req, res, next){
    var name = req.params.ticker.toString('utf8');
    getTickers().then((symbols) => {
	var i = 0;
	while (i < symbols.length) {
	    if (symbols[i] == name) {
		res.end("ok");
		return;
	    }
	}
	res.end("not found");	
    }
		     )
})
		       



router.get('/regist/:ticker', function(req, res, next){
    var Ticker = db.model("Ticker");
    var name = req.params.ticker.toString('utf8') ;
    console.log("Saving ticker...", req.params.ticker.toString('utf8'));
    Ticker.findOne({"name":name}, function(err, item) {
	if (err) {
	    res.end(err); return;
	}
	if (item) {
	    res.end("already registered"); return;
	}
	var newSymbol = new Ticker({ name: name});

	newSymbol.save(function(err) {
	    res.end(err || "Successfully regist stock");
	});
    });
});

router.get('/disconnect', function(req, res, next){
  if (db.readyState === 1){
    mongoose.disconnect();
  }
  res.end("Disconnected from database at " + new Date().toString());
});

module.exports = router;
