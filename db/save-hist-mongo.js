var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');

var histSchema = mongoose.Schema({
  symbol: String,
  data: Number,
  timestamp: Number
});

var Hist = mongoose.model('Hist', histSchema);

var save = function(stocks){
    return new Promise(function (resolve, reject){
	async.each(stocks, function(stock, nextcb){
	    console.log(stock);
            var currentQuote = new Hist({
		symbol: stock["symbol"],
		data: stock,
		timestamp: new Date().getTime()
            });
	    currentQuote.save((err, data) => { console.log("Quote for", stock["symbol"], "saved at", moment().format('lll')); nextcb(null); })
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
	var result = [];
	async.each(stocks, function(stock, nextcb){	
	    Hist.findOne({name: stock}, function(err, item) {
		result << item;
	    });
	},
		   function(err) {
		       resolve(result);
		   });
    });
}


module.exports.load = load;
module.exports.save = save;
