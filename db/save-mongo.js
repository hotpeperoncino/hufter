var mongoose = require('mongoose');
var moment = require('moment');
var YFquotes = require('../queries/quotes');
var async = require('async');
mongoose.Promise = global.Promise;
//assert.equal(query.exec().constructor, global.Promise);

var quoteSchema = mongoose.Schema({
  symbol: String,
  lastTradePrice: Number,
  timestamp: Number,
  data: String
});

var Quote = mongoose.model('Quote', quoteSchema);

var save = function(stocks){
    return new Promise(function (resolve, reject){
	async.each(stocks, function(stock, nextcb){
	    console.log(stock);
	    if (stock["lastTradePriceOnly"]) {
		var currentQuote = new Quote({
		  symbol: stock["symbol"],
		  lastTradePrice: stock["lastTradePriceOnly"],
		  data: JSON.stringify(stock),
		  timestamp: new Date().getTime()
		});
		currentQuote.save((err, data) => { console.log("Quote for", stock["symbol"], "saved at", moment().format('lll')); nextcb(null); })
	    } else {
		console.log("Could not save trade data for ", stock["symbol"], " at ", moment().format('lll'), "(", moment().tz('America/New_York').format('lll'), "market time )");
		nextcb("error");
	    }
	},
		   function(err) {
		       if (err)
 			   reject("Things haven't saved!");
		       else
			   resolve("Successfully saved data at " + moment().format('lll'));
		   });
    });
}



var load = function(stocks){
    return new Promise(function (resolve, reject){
      var result = {};
      async.each(stocks, function(stock, nextcb){
	console.log(stock);
	Quote.find({symbol: stock}, function(err, items) {
	  if (err) {
	    nextcb(err);
	    return;
	  }
	  if (items == null) {
	    nextcb(null);
	    return;
	  }
	  console.log(items);
	  result[stock] = items;
	  nextcb(null);
	});
      },
		 function(err) {
		   console.log(err);
		   if (err) reject(err);
		   else resolve(result);
		 });
    });
}


module.exports.load = load;
module.exports.save = save;
