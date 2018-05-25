var express = require('express');
var request = require('request');
var csvToLayer = require('./csvToLayer').CsvToLayer;
var _csv = new csvToLayer();
var createServer = function (app) {
    var server = {
        config: {
            port: 9001,
            static_base_directory: "./app" //dist/app  //test/requesttest/
        },
        app: app,
        serve: function (port) {
            this.app.use('/', express.static(this.config.static_base_directory));
            var _port = port || this.config.port;
            this.app.listen(_port);
            console.log("server is listening on port: " + _port);
            console.log("serve files from: " + this.config.static_base_directory);
        }
    };
    return server;
};
var proxy = function (req, res) {
    //modify the url in any way you want
    console.log(req.url);
    var apiServerHost = "https://ahocevar.com/geoserver/wms";
    var url = apiServerHost + req.url;
    var newReq = request(url);
    newReq.on('error', function (error) {
        res.status(500).send(error);
    });
    req.pipe(newReq).pipe(res);
};
var server_instance = new createServer(express());
server_instance.app.use('/proxy', proxy);
server_instance.app.route('/data').get(function (req, res) {
    var _date = req.param('date');
    var filename = _csv.getFileFromDate(_date);
    console.log(_date);
    if (!_date || _date == 'undefined') {
        return;
    }
    else {
        _csv.parse("./data/" + filename, function (data) {
            //console.log(data)
            res.send(data);
        });
    }
});
server_instance.app.route('/times').get(function (req, res) {
    _csv.getTimes('./data/', function (files) {
        res.send(files);
    });
});
server_instance.serve();
