/// <reference path="createsamplepoints.ts"/>


declare var ol: any, turf: any;


var epsg = 'EPSG:4326';
//geojson
var GEOJSON = new ol.format.GeoJSON();


var points = createPoints(1);

var pontsjson = reducePoints(points, checkIfInPoly); //

var placesSource = new ol.source.Vector({
    features: GEOJSON.readFeatures(pontsjson)
});
var places = new ol.layer.Grid({
    source: placesSource,
    id: "places"
})



// create baselayer and Map
var raster = new ol.layer.Tile({
    source: new ol.source.OSM({
        wrapX: false
    }),
    id: 'osm'
});

var map = new ol.Map({
    //layers: [raster, bbox, vector, places],
    layers: [raster, places],
    target: 'map',
    view: new ol.View({
        projection: epsg,
        center: [0, 0],
        zoom: 3
    })
});


//click on features
map.on("click", (e) => {
    //forEachFeatureAtPixel(pixel, callback, opt_options)
    map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        console.log(feature.get('value')) //
    }, {
            layerFilter: (layer) => {
                //console.log(layer.get('id'))
                return layer.getSource() instanceof ol.source.Vector;
            },
            hitTolerance: 0
        })

});
