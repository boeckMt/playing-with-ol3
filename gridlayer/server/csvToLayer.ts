var csv = require('fast-csv');
var fs = require('fs');


export interface ICsvToLayer {
  parse(path: string, cb: Function);
}

export class CsvToLayer implements ICsvToLayer {
  FeatureCollection: any;

  constructor() {
    this.FeatureCollection = {
      "type": "FeatureCollection",
      "features": []
    }
  }
  //'../data/TUG_NRT_20170505.csv'
  /**
  CSV World Grid 360 Cells 180 cells
  if value is >0 create point
  read css
  data [360:[]]
  value:The index expresses the deviation of the GRACE-derived total water storage anomaly (TWSA) from the mean seasonal cycle in units of standard deviation.
  */

  clearFeatureCollection() {
    this.FeatureCollection.features.length = 0;
  }

  parse(path: string, cb: Function) {
    var line = 0;
    var stream = fs.createReadStream(path);
    var csvStream = csv
      .parse()
      .on("data", (data) => {
        //line by line data
        this.createPoints(data, line);
        line++;
      })
      .on("end", () => {
        console.log("done");
        cb(this.FeatureCollection);
        this.clearFeatureCollection();
      });
    stream.pipe(csvStream);
  }

  getTimes(path: string, cb: Function) {
    fs.readdir(path, (err, files: Array<string>) => {
      if (err) {
        return;
      }

      var _dates = [];
      for (let i = 0; i < files.length; i++) {
        _dates.push(this.getDateFromName(files[i]));
      }
      _dates.sort();
      cb(_dates);
    });
  }

  getDateFromName(filename: string) {
    var reg = /\d{4}\d{2}\d{2}/;
    var reg2 = /\d{4}\/\d{2}\/\d{2}/;
    var match = filename.match(reg);
    if (match[0]) {
      let _date = match[0];
      let date = _date.slice(0, 4) + "/" + _date.slice(4, 6) + "/" + _date.slice(6, 8);
      return date;
    } else {
      return match;
    }
  }

  // yyyy/mm/dd
  getFileFromDate(date: string) {
    var _date = date.replace('/', '');
    var filename = `EGSIEM_NRT_MFE_${_date}.csv`;
    return filename;
  }

  getColor(value: number) {
    var opacity = 1;
    var colors = [
      [64, 0, 0, opacity], //< -4
      [128, 0, 0, opacity],
      [254, 0, 0, opacity],
      [255, 127, 0, opacity],
      [255, 255, 0, opacity], // < -2
      [255, 255, 255, opacity], // withe
      [127, 191, 255, opacity], // > 2
      [0, 191, 254, opacity], //2.5
      [0, 127, 255, opacity], //3
      [0, 0, 254, opacity], //3.5
      [1, 0, 128, opacity] // > 4
    ]
    if (value <= -4) {
      return colors[0];
    } else if (value > -4 && value <= -3.5) {
      return colors[1];
    } else if (value > -3.5 && value <= -3) {
      return colors[2];
    } else if (value > -3 && value <= -2.5) {
      return colors[3];
    } else if (value > -2.5 && value < -2) {
      return colors[4];
      //------------------------------------
    } else if (value >= 2 && value < 2.5) {
      return colors[6];
    } else if (value >= 2.5 && value < 3) {
      return colors[7];
    } else if (value >= 3 && value < 3.5) {
      return colors[8];
    } else if (value >= 3.5 && value < 4) {
      return colors[9];
    } else if (value >= 4) {
      return colors[10];
      //------------------------------------
    } else {
      return colors[5];
    }

  }

  createPoints(data: Array<any>, line: number) {
    var xmin = -179.5,
      xmax = 179.5,
      ymax = 89.5,
      ymin = -89.5;
    var cellsize = 1;
    var _x = xmin;
    var _y = ymax;
    var len = data.length;
    for (let x = 0; x < len; x++) {
      let _value = data[x];
      _y = ymax - line;
      if (_value > -2 && _value < 2) {
        //console.log(x, `value=${data[x]}`, `lng=${_x}`, `lat=${_y}`);
        //this.FeatureCollection.features.push(this.createFeature({lat:_y, lng:_x},{value:_value, color: this.getColor(_value)}))
      } else {
        //this.FeatureCollection.features.push(this.createPointFeature({ lat: _y, lng: _x }, { value: _value, color: this.getColor(_value) }))
        this.FeatureCollection.features.push(this.createPolyFeature({ lat: _y, lng: _x }, { value: _value, color: this.getColor(_value) }))
      }
      _x += cellsize;

    }
  }


  createPointFeature(point: { lat: number, lng: number }, attributes: Object) {
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
  }

  createPolyFeature(point: { lat: number, lng: number }, attributes: Object) {
    return {
      "type": "Feature",
      "properties": attributes,
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          this.drawCell(point.lng,point.lat, 0.5)
        ]
      }
    };
  }

  drawCell(x: number, y: number, radius: number) {
    var x_min = x - radius, x_max = x + radius,
      y_min = y - radius, y_max = y + radius;
    var poly = [
        [x_min, y_max], [x_max, y_max], [x_max, y_min], [x_min, y_min], [x_min, y_max]
    ];
    return poly;
  }

}
