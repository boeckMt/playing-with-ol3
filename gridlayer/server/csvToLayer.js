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
    value:The index expresses the deviation of the GRACE-derived total water storage anomaly (TWSA) from the mean seasonal cycle in units of standard deviation.
    */
    CsvToLayer.prototype.parse = function (path, cb) {
        var _this = this;
        var line = 0;
        var stream = fs.createReadStream(path);
        var csvStream = csv
            .parse()
            .on("data", function (data) {
            //line by line data
            _this.createPoints(data, line);
            line++;
        })
            .on("end", function () {
            console.log("done");
            cb(_this.FeatureCollection);
        });
        stream.pipe(csvStream);
    };
    CsvToLayer.prototype.getTimes = function (path, cb) {
        var _this = this;
        fs.readdir(path, function (err, files) {
            if (err) {
                return;
            }
            var _dates = [];
            for (var i = 0; i < files.length; i++) {
                _dates.push(_this.getDateFromName(files[i]));
            }
            _dates.sort();
            cb(_dates);
        });
    };
    CsvToLayer.prototype.getDateFromName = function (filename) {
        var reg = /\d{4}\d{2}\d{2}/;
        var reg2 = /\d{4}\/\d{2}\/\d{2}/;
        var match = filename.match(reg);
        if (match[0]) {
            var _date = match[0];
            var date = _date.slice(0, 4) + "/" + _date.slice(4, 6) + "/" + _date.slice(6, 8);
            return date;
        }
        else {
            return match;
        }
    };
    // yyyy/mm/dd
    CsvToLayer.prototype.getFileFromDate = function (date) {
        var _date = date.replace('/', '');
        var filename = "EGSIEM_NRT_MFE_" + _date + ".csv";
        return filename;
    };
    CsvToLayer.prototype.getColor = function (value) {
        var opacity = 1;
        var colors = [
            [64, 0, 0, opacity],
            [128, 0, 0, opacity],
            [254, 0, 0, opacity],
            [255, 127, 0, opacity],
            [255, 255, 0, opacity],
            [255, 255, 255, opacity],
            [127, 191, 255, opacity],
            [0, 191, 254, opacity],
            [0, 127, 255, opacity],
            [0, 0, 254, opacity],
            [1, 0, 128, opacity] // > 4
        ];
        if (value <= -4) {
            return colors[0];
        }
        else if (value > -4 && value <= -3.5) {
            return colors[1];
        }
        else if (value > -3.5 && value <= -3) {
            return colors[2];
        }
        else if (value > -3 && value <= -2.5) {
            return colors[3];
        }
        else if (value > -2.5 && value < -2) {
            return colors[4];
            //------------------------------------
        }
        else if (value >= 2 && value < 2.5) {
            return colors[6];
        }
        else if (value >= 2.5 && value < 3) {
            return colors[7];
        }
        else if (value >= 3 && value < 3.5) {
            return colors[8];
        }
        else if (value >= 3.5 && value < 4) {
            return colors[9];
        }
        else if (value >= 4) {
            return colors[10];
            //------------------------------------
        }
        else {
            return colors[5];
        }
    };
    CsvToLayer.prototype.createPoints = function (data, line) {
        var xmin = -179.5, xmax = 179.5, ymax = 89.5, ymin = -89.5;
        var cellsize = 1;
        var _x = xmin;
        var _y = ymax;
        var len = data.length;
        for (var x = 0; x < len; x++) {
            var _value = data[x];
            _y = ymax - line;
            if (_value > -2 && _value < 2) {
                //console.log(x, `value=${data[x]}`, `lng=${_x}`, `lat=${_y}`);
                //this.FeatureCollection.features.push(this.createFeature({lat:_y, lng:_x},{value:_value, color: this.getColor(_value)}))
            }
            else {
                this.FeatureCollection.features.push(this.createFeature({ lat: _y, lng: _x }, { value: _value, color: this.getColor(_value) }));
            }
            _x += cellsize;
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
