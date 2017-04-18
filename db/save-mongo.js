var mongoose = require('mongoose');
var moment = require('moment');
var YFquotes = require('../queries/quotes');
var async = require('async');

var quoteSchema = mongoose.Schema({
  symbol: String,
  lastTradePrice: Number,
  timestamp: Number
});

var Quote = mongoose.model('Quote', quoteSchema);

var save = function(stocks){
    return new Promise(function (resolve, reject){
	async.each(stocks, function(stock, nextcb){
	    console.log(stock);
	    if (stock["LastTradePriceOnly"]) {
		var currentQuote = new Quote({
		    symbol: stock["symbol"],
		    lastTradePrice: stock["LastTradePriceOnly"],
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





module.exports.save = save;
