var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var text = '<html><body><a href="/db/regist/SPY">regist SPY</a><br></body></html>';
  res.send(text);
});

module.exports = router;
