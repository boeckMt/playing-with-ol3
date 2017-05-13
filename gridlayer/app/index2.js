/// <reference path="createsamplepoints.ts"/>
var epsg = 'EPSG:4326';
//geojson
var GEOJSON = new ol.format.GeoJSON();
//var points = createPoints(1);
//console.log(points)
//var pontsjson = reducePoints(points); //
//console.log(pontsjson)
//http://localhost:9001/data/
/*
var placesSource = new ol.source.Vector({
    features: GEOJSON.readFeatures(pontsjson)
});
*/
// create baselayer and Map
var raster = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'https://ahocevar.com/geoserver/wms',
        params: {
            'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
            'TILED': true
        },
        wrapX: false
    }),
    id: 'topo'
});
var map = new ol.Map({
    //layers: [raster, bbox, vector, places],
    //layers: [raster, places],
    layers: [raster],
    target: 'map',
    view: new ol.View({
        projection: epsg,
        center: [0, 0],
        zoom: 3
    })
});
//------------------------------------------------------------------------------
var urlParam = location.search.split('=')[1];
$.get("http://localhost:9001/data?date=" + urlParam, function (data) {
    console.log(data);
    var pontsjson = data;
    var placesSource = new ol.source.Vector({
        features: GEOJSON.readFeatures(pontsjson),
        wrapX: false
    });
    var places = new ol.layer.Grid({
        source: placesSource,
        id: "places"
    });
    map.addLayer(places);
});
//click on features
map.on("click", function (e) {
    //forEachFeatureAtPixel(pixel, callback, opt_options)
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        console.log(feature.get('value')); //
    }, {
        layerFilter: function (layer) {
            //console.log(layer.get('id'))
            return layer.getSource() instanceof ol.source.Vector;
        },
        hitTolerance: 0
    });
});
