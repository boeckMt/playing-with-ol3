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
  */
  parse(path: string, cb: Function) {
    var stream = fs.createReadStream(path);
    var csvStream = csv
    .parse()
    .on("data",(data)=>{
        this.createPoints(data);
    })
    .on("end",()=>{
         console.log("done");
    });
    stream.pipe(csvStream);
  }

  createPoints(data){
    console.log(data.length)

    for(let x = 1; x <= data.length; x++){
      console.log(x, data[x])
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
