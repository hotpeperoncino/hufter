var mongoose = require('mongoose');
var moment = require('moment');
var tz = require('moment-timezone');
var range = require('moment-range');
var YFquotes = require('../queries/quotes');
var _ = require('ramda');
var uniq = require('uniq');

mongoose.Promise = global.Promise;
//assert.equal(query.exec().constructor, global.Promise);

var db = mongoose.connection;
var host = process.env["DB_HOST"]
host = "mongodb://test:test@localhost/hufter";
console.log(host);
mongoose.connect(host);

var tickerSchema = mongoose.Schema({ name: String });
var Ticker = mongoose.model('Ticker', tickerSchema);

function getTickers(){
  console.log("getTickers");
  return Ticker
    .find({})
    .exec()
    .then((tickers) => { console.log(tickers); return _.pluck('name', tickers)})
    .then(uniq);
}

module.exports.getTickers = getTickers;
