var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');
mongoose.Promise = global.Promise;
//assert.equal(query.exec().constructor, global.Promise);

var histSchema = mongoose.Schema({
  symbol: String,
  data: String,
  timestamp: Number
});

var Hist = mongoose.model('Hist', histSchema);

var save = function(stocks){
  var keys = [];
  for (n in stocks) keys.push(n);
  
  return new Promise(function (resolve, reject) {
//	    console.log(stocks);    
    async.each(keys, function(key, nextcb){
      var stock = stocks[key];
            var currentQuote = new Hist({
	      symbol: key,
	      data: JSON.stringify(stock),
	      timestamp: new Date().getTime()
            });
	    currentQuote.save((err, data) => { console.log("Quote for", key, "saved at", moment().format('lll')); nextcb(null); })
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
	Hist.findOne({symbol: stock}, function(err, item) {
	  console.log(err);	  
	  if (err) {
	    nextcb(err);
	    return;
	  }
	  if (item == null) {
	    nextcb(null);
	    return;
	  }
	  result[item.symbol] = JSON.parse(item.data);
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
