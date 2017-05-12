declare var ol: any, turf: any;

var checkIfPlaceInCell = (pointfeature: any, polyfeature: any) => {
    var _point = GEOJSON.writeFeatureObject(pointfeature)
    var _poly = GEOJSON.writeFeatureObject(polyfeature)

    var isInside = turf.inside(_point, _poly);
    return isInside;
}

var checkIfInPoly = (point,useExtent) => {
    var pt1 = GEOJSON.writeFeatureObject(new ol.Feature(point))

    var bboxExtent = {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "Polygon",
        "coordinates":[
            [[-170, 80], [170, 80], [170, -80], [-170, -80], [-170, 80]]
        ]
    }
    }
    var poly = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        19.248046875,
                        -33.504759069226075
                    ],
                    [
                        15.908203125,
                        -27.371767300523032
                    ],
                    [
                        13.798828125,
                        -20.632784250388013
                    ],
                    [
                        12.12890625,
                        -15.623036831528252
                    ],
                    [
                        14.414062499999998,
                        -11.60919340793894
                    ],
                    [
                        13.18359375,
                        -9.102096738726443
                    ],
                    [
                        11.865234375,
                        -5.0909441750333855
                    ],
                    [
                        9.140625,
                        -0.7031073524364783
                    ],
                    [
                        10.634765625,
                        3.8642546157214084
                    ],
                    [
                        7.03125,
                        6.577303118123887
                    ],
                    [
                        0.439453125,
                        8.233237111274553
                    ],
                    [
                        -8.96484375,
                        6.053161295714067
                    ],
                    [
                        -15.908203125,
                        16.97274101999902
                    ],
                    [
                        -5.9765625,
                        23.725011735951796
                    ],
                    [
                        28.916015625,
                        29.22889003019423
                    ],
                    [
                        37.177734375,
                        19.80805412808859
                    ],
                    [
                        42.71484375,
                        10.660607953624762
                    ],
                    [
                        50.71289062499999,
                        9.88227549342994
                    ],
                    [
                        39.287109375,
                        -3.425691524418062
                    ],
                    [
                        41.044921875,
                        -8.494104537551882
                    ],
                    [
                        38.935546875,
                        -16.720385051693988
                    ],
                    [
                        34.27734375,
                        -21.616579336740593
                    ],
                    [
                        34.189453125,
                        -25.005972656239177
                    ],
                    [
                        30.146484374999996,
                        -30.524413269923986
                    ],
                    [
                        26.279296875,
                        -34.234512362369856
                    ],
                    [
                        21.708984375,
                        -34.37971258046219
                    ],
                    [
                        19.248046875,
                        -33.504759069226075
                    ]
                ]
            ]
        }
    };
    if(useExtent){
      poly = bboxExtent;
    }
    var isInside = turf.inside(pt1, poly);
    return isInside;
}

// create points ---------------------------------------------------------------
class Point {
    value: number;
    constructor(private x: number, private y: number) {
        var num: any = Math.random() * 100;
        this.value = parseInt(num);
    }
}

var createPoints = (cellsize?: number) => {
    var points = [];

    cellsize = cellsize || 1;

    var radius = (cellsize / 2),
        _x = 180 - radius, _y = 90 - radius;

    for (let x = -_x; x <= _x; x += cellsize) {
        for (let y = -_y; y <= _y; y += cellsize) {
            let point = new Point(x, y);
            points.push(point)
        }
    }

    return points;
}

var reducePoints = (points, clipfn?:Function) => {
    var newPoints = [];

    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        var pointgeom = new ol.geom.Point([point.x, point.y])
        if(clipfn){
          if (clipfn(pointgeom)) {
              let _point = new ol.Feature({
                  geometry: pointgeom,
                  value: point.value
              });
              newPoints.push(_point)
          }
        }else{
          if(checkIfInPoly(pointgeom,true)){
            let _point = new ol.Feature({
                geometry: pointgeom,
                value: point.value
            });
            newPoints.push(_point)
          }
        }

    }
    var newFeatures = GEOJSON.writeFeaturesObject(newPoints);
    return newFeatures;
}


//------------------------------------------------------------------------------
/*
//projecton bbox
var bboxSource = new ol.source.Vector({
    wrapX: false
})
bboxSource.addFeature(new ol.Feature(
    new ol.geom.Polygon([
        [[-180, 90], [180, 90], [180, -90], [-180, -90], [-180, 90]]
    ]))
);
var bbox = new ol.layer.Vector({
    source: bboxSource,
    id: 'bbox'
});
*/
//------------------------------------------------------------------------------


/* export geojson
var jsonstr = GEOJSON.writeFeatures(vectorSource.getFeatures())


function download(text, name, type) {
    var a:any = document.getElementById('download');
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    //a.click();
}
download(jsonstr, 'test.json', 'application/json');
*/


/*

//------------------------------------------------------------------------------
//Places
var geojsonObject = {
    "type": "FeatureCollection",
    'crs': {
        'type': 'name',
        'properties': {
            'name': epsg
        }
    },
    "features": [
        {
            "type": "Feature",
            "properties": {
                "value": "test1"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    1.669921875,
                    18.396230138028827
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "value": "test2"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    33.134765625,
                    14.179186142354181
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "value": "test3"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    21.62109375,
                    -6.577303118123875
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "value": "test4"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    25.576171875,
                    -22.67484735118851
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "value": "test5"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    19.51171875,
                    20.2209657795223
                ]
            }
        }
    ]

};

var placeStyle = (feature, resolution) => {
    var value = feature.get('risk');


    var placeStyle;

    if (value != undefined) {
        placeStyle = new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({ color: value }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1
                })
            })
        })
        console.log(value)
    } else {
        placeStyle = new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({ color: [255, 255, 255, 1] }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1
                })
            })
        })
    }
    console.log(placeStyle)
    return placeStyle;
}

var placesSource = new ol.source.Vector({
    features: GEOJSON.readFeatures(geojsonObject)
});
var places = new ol.layer.Vector({
    source: placesSource,
    style: placeStyle,
    id: "places"
})
//------------------------------------------------------------------------------


// grid with style -------------------------------------------------------------

var gridStyle = (feature, resolution) => {
    var opacity = 0.6;
    var colors = [
        [254, 240, 217, opacity],
        [253, 212, 158, opacity],
        [253, 187, 132, opacity],
        [252, 141, 89, opacity],
        [227, 74, 51, opacity],
        [179, 0, 0, opacity]
    ]

    var fill = new ol.style.Fill();
    var style = new ol.style.Style({
        fill: fill,
          //  stroke: new ol.style.Stroke({
          //      color: '#fff',
          //      width:
          //  })
    });

    var value = feature.get('value');
    if (value >= 0 && value < 10) {
        fill.setColor(colors[0]);
    } else if (value >= 10 && value < 20) {
        fill.setColor(colors[1]);
    } else if (value >= 20 && value < 40) {
        fill.setColor(colors[2]);
    } else if (value >= 40 && value < 60) {
        fill.setColor(colors[3]);
    } else if (value >= 60 && value < 80) {
        fill.setColor(colors[4]);
    } else if (value >= 80) {
        fill.setColor(colors[5]);
    }
    return style;
}

var vectorSource = new ol.source.Vector({
    wrapX: false
});

var vector = new ol.layer.Vector({
    source: vectorSource,
    style: gridStyle,
    id: 'gridLayer'

      //  style: new ol.style.Style({
        //    image: new ol.style.RegularShape({
        //        fill: new ol.style.Fill({
        //            color: [0, 128, 0, 2, 1]
        //        }),
        //        stroke: new ol.style.Stroke({
        //            color: [255, 255, 255, 1],
        //            width: 1
        //        }),
        //        points: 4,
        //        radius: 10,
        //        angle: Math.PI / 4
        //    })
      //  }),
      //  scale: 4


});
*/

// create points ---------------------------------------------------------------
/*
class Point {
    value: number;
    constructor(private x: number, private y: number) {
        var num: any = Math.random() * 100;
        this.value = parseInt(num);
    }
}

var createPoints = (cellsize?: number) => {
    var points = [];

    cellsize = cellsize || 1;

    var radius = (cellsize / 2),
        _x = 180 - radius, _y = 90 - radius;

    for (let x = -_x; x <= _x; x += cellsize) {
        for (let y = -_y; y <= _y; y += cellsize) {
            let point = new Point(x, y);
            points.push(point)
        }
    }

    return points;
}

var reducePoints = (points) => {
    var newPoints = [];

    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        var pointgeom = new ol.geom.Point([point.x, point.y])


        if (checkIfInPoly(pointgeom)) {
            let _point = new ol.Feature({
                geometry: pointgeom,
                value: point.value
            });
            newPoints.push(_point)
        }
    }
    var newFeatures = GEOJSON.writeFeaturesObject(newPoints);
    return newFeatures;
}
*/
//------------------------------------------------------------------------------

/*
var drawGrid = (cellsize?: number, points?: Array<any>) => {
    var drawCell = (x: number, y: number, radius: number) => {
        var x_min = x - radius, x_max = x + radius,
            y_min = y - radius, y_max = y + radius;
        var poly = new ol.geom.Polygon([
            [
                [x_min, y_max], [x_max, y_max], [x_max, y_min], [x_min, y_min], [x_min, y_max]
            ]
        ]);
        return poly;
    }

    cellsize = cellsize || 1;

    var radius = (cellsize / 2),
        _x = 180 - radius, _y = 90 - radius;

    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        var poly = drawCell(point.x, point.y, (cellsize / 2));
        var pointgeom = new ol.geom.Point([point.x, point.y])


        if (checkIfInPoly(pointgeom)) {
            let cellfeature = new ol.Feature({
                geometry: poly,
                value: point.value
            });

            placesSource.getFeatures().forEach((pointfeature) => {
                let isIn = checkIfPlaceInCell(pointfeature, cellfeature);
                if (isIn && cellfeature.get('value') > 80) {
                    pointfeature.set('risk', 'rgba(255, 0, 0, 1)')
                    console.log(pointfeature.get('value'), poly)
                }

            })

            vectorSource.addFeature(cellfeature);
        }

    }
    //console.log(jsonstr)
}

drawGrid(1, points);

*/

//------------------------------------------------------------------------------
