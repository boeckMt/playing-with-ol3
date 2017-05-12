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
  parse(path: string, cb: Function) {
    var line = 0;
    var stream = fs.createReadStream(path);
    var csvStream = csv
    .parse()
    .on("data",(data)=>{
        //line by line data
        this.createPoints(data, line);
        line++;
    })
    .on("end",()=>{
         console.log("done");
          cb(this.FeatureCollection);
    });
    stream.pipe(csvStream);
  }

  getColor(value:number){
    var opacity = 1;
    var colors = [
        [64,0,0, opacity], //< -4
        [128,0,0, opacity],
        [254,0,0, opacity],
        [255,127,0, opacity],
        [255,255,0, opacity], // < -2
        [255,255,255, opacity], // withe
        [127,191,255, opacity], // > 2
        [0,191,254, opacity], //2.5
        [0,127,255, opacity], //3
        [0,0,254, opacity], //3.5
        [1,0,128, opacity] // > 4
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
    }else if (value >= 2 && value < 2.5) {
        return colors[6];
    } else if (value >= 2.5 && value < 3) {
        return colors[7];
    } else if (value >= 3 && value < 3.5) {
        return colors[8];
    }else if (value >= 3.5 && value < 4) {
        return colors[9];
    } else if (value >= 4) {
        return colors[10];
    //------------------------------------
    } else{
      return colors[5];
    }

  }

  createPoints(data:Array<any>,line:number){
    var xmin =-179.5,
        xmax = 179.5,
        ymax = 89.5,
        ymin = -89.5;
    var cellsize = 1;
    var _x = xmin;
    var _y = ymax;
    var len = data.length;
    for(let x = 0; x < len; x++){
      let _value = data[x];
      _y=ymax-line;
      if(_value >-2  && _value <2){
        //console.log(x, `value=${data[x]}`, `lng=${_x}`, `lat=${_y}`);
        //this.FeatureCollection.features.push(this.createFeature({lat:_y, lng:_x},{value:_value, color: this.getColor(_value)}))
      }else{
        this.FeatureCollection.features.push(this.createFeature({lat:_y, lng:_x},{value:_value, color: this.getColor(_value)}))
      }
      _x+=cellsize;

    }
  }

  checkValue(value:number){
    if(value > 0){
      let point = {lat: 90, lng: -180};
      let feature = this.createFeature(point, {wetness: value})
      this.FeatureCollection.features.push(point);
    }
  }

  createFeature(point:{lat:number, lng:number}, attributes:Object){
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

}
