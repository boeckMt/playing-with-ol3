var request = require('request');
const express = require('express');
var app = express();

app.use(express.static('app'))

var proxy = (req, res)=>{
  var proxyurl = 'https://geoservice.dlr.de/';
  var requrl = req.originalUrl.replace('/proxy/','')
  req.pipe(request({
    url: requrl,
    baseUrl: proxyurl,
    method: req.method
  })).pipe(res);
}

app.use('/proxy*', proxy);

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
