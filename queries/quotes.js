var nyf = require('./node-yahoo-finance')
var moment = require('moment');
var _ = require('ramda');

var FIELDS = _.flatten([
  // Pricing
  ['a', 'b', 'b2', 'b3', 'p', 'o'],
  // Dividends
  ['y', 'd', 'r1', 'q'],
  // Date
  ['c1', 'c', 'c6', 'k2', 'p2', 'd1', 'd2', 't1'],
  // Averages
  ['c8', 'c3', 'g', 'h', 'k1', 'l', 'l1', 't8', 'm5', 'm6', 'm7', 'm8', 'm3', 'm4'],
  // Misc
  ['w1', 'w4', 'p1', 'm', 'm2', 'g1', 'g3', 'g4', 'g5', 'g6'],
  // 52 Week Pricing
  ['k', 'j', 'j5', 'k4', 'j6', 'k5', 'w'],
  // System Info
  ['i', 'j1', 'j3', 'f6', 'n', 'n4', 's1', 'x', 'j2'],
  // Volume
  ['v', 'a5', 'b6', 'k3', 'a2'],
  // Ratio
  ['e', 'e7', 'e8', 'e9', 'b4', 'j4', 'p5', 'p6', 'r', 'r2', 'r5', 'r6', 'r7', 's7'],
  // Misc
  ['t7', 't6', 'i5', 'l2', 'l3', 'v1', 'v7', 's6', 'e1']
]);


var getStockData = function (symbols, metrics){
  console.log("getstockdata",symbols, metrics);
    return nyf.snapshot({fields:FIELDS, symbols:symbols});
}

function parseStartDate(startDate){
  if (!startDate) { return moment().subtract(1, 'years').format("YYYY-MM-DD") }
  else {
    var startDate = moment(startDate);
    if (startDate.isValid()) { return startDate.format("YYYY-MM-DD"); }
    else { return `Start date ${startDate} is invalid. Please enter date in parseable format.`}
  }
}

function parseEndDate(endDate){
  if (!endDate) { return moment().format("YYYY-MM-DD") }
  else {
    var endDate = moment(endDate);
    if (endDate.isValid()) { return endDate.format("YYYY-MM-DD"); }
    else { return `End date ${endDate} is invalid. Please enter date in parseable format.`}
  }
}

getStockDatawithOptions = _.curry(getStockData);

module.exports.getStockData = getStockData;
module.exports.getAllData = getStockDatawithOptions(_.__, null);
module.exports.getLastTrade = getStockDatawithOptions(_.__, "LastTradePriceOnly");
module.exports.getVolume = getStockDatawithOptions(_.__, "Volume");
module.exports.getLastTradeWithVolume = getStockDatawithOptions(_.__, ["LastTradePriceOnly", "Volume"])
module.exports.getAverageDailyVolume = getStockDatawithOptions(_.__, "AverageDailyVolume")



