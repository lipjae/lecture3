var express = require('express');
var router = express.Router();
const mapData = require("../json/jsonFile.json")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getMapData', function(req, res, next) {
  res.json(mapData)
})

module.exports = router;
