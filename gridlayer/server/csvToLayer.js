"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var csv = require('fast-csv');
var fs = require('fs');
var CsvToLayer = (function () {
    function CsvToLayer() {
        this.FeatureCollection = {
            "type": "FeatureCollection",
            "features": []
        };
    }
    //'../data/TUG_NRT_20170505.csv'
    /**
    CSV World Grid 360 Cells 180 cells
    if value is >0 create point
    read css
    data [360:[]]
    */
    CsvToLayer.prototype.parse = function (path, cb) {
        var _this = this;
        var stream = fs.createReadStream(path);
        var csvStream = csv
            .parse()
            .on("data", function (data) {
            _this.createPoints(data);
        })
            .on("end", function () {
            console.log("done");
        });
        stream.pipe(csvStream);
    };
    CsvToLayer.prototype.createPoints = function (data) {
        console.log(data.length);
        for (var x = 1; x <= data.length; x++) {
            console.log(x, data[x]);
        }
        //console.log(data[0].length)
        /*
          var points = [];
          var cellsize = 1; //1 grad
    
          var radius = (cellsize / 2),
              _x = 180 - radius,
              _y = 90 - radius;
    
          for (let x = -_x; x <= _x; x += cellsize) {
              for (let y = -_y; y <= _y; y += cellsize) {
                  let point = this.createFeature();
                  points.push(point)
              }
          }
    
          return points;
          */
    };
    CsvToLayer.prototype.checkValue = function (value) {
        if (value > 0) {
            var point = { lat: 90, lng: -180 };
            var feature = this.createFeature(point, { wetness: value });
            this.FeatureCollection.features.push(point);
        }
    };
    CsvToLayer.prototype.createFeature = function (point, attributes) {
        return {
            "type": "Feature",
            "properties": attributes,
            "geometry": {
                "type": "Point",
                "coordinates": [
                    point.lng,
                    point.lat
                ]
            }
        };
    };
    return CsvToLayer;
}());
exports.CsvToLayer = CsvToLayer;
