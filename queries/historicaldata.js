var nyf = require('./node-yahoo-finance')
var moment = require('moment');
var _ = require('ramda');

function getStockData(symbols, metrics, startDate, endDate){
    console.log(symbols, metrics, startDate, endDate);

  var startDateResult = parseStartDate(startDate);
  var endDateResult = parseEndDate(endDate);
  
    if (!moment(startDateResult).isValid()) { return Promise.reject(startDate) }
    if (!moment(endDateResult).isValid()) { return Promise.reject(endDate) }

    console.log(symbols, metrics, startDateResult, endDateResult);

    return nyf.historical({symbols: symbols, from: startDateResult, to: endDateResult, period: 'd'});
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

module.exports.getHistoricalData = getStockData;
module.exports.getAllData = getStockDatawithOptions(_.__, null, _.__, _.__);
module.exports.getLastYear = getStockDatawithOptions(_.__, null, null, null);
module.exports.getVolume = getStockDatawithOptions(_.__, "Volume");
module.exports.getHighLow = getStockDatawithOptions(_.__, ["High", "Low"]);
module.exports.getOpenClose = getStockDatawithOptions(_.__, ["Open", "Close"]);
module.exports.getAdjClose = getStockDatawithOptions(_.__, "Adj_Close");



