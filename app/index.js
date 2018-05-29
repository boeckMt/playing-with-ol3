//var color = [255,0,0,1]; //rgba(255, 0, 0, 1); rot
var recolor = function (pixel) {
    // 0 - 255
    var r = pixel[0], g = pixel[1], b = pixel[2], a = pixel[3];
    r = 255;
    g = 0;
    b = 0;
    return [r, g, b, a];
};
var tilesource = new ol.source.TileWMS({
    attributions: ['&copy; DLR/EOC'],
    url: '/proxy/eoc/basemap/wms',
    params: {
        'LAYERS': 'osm_roads_gen3',
    }
});
var roads_raster = new ol.source.Raster({
    sources: [
        tilesource
    ],
    operation: function (pixels, data) {
        return recolor(pixels[0]);
    },
    lib: {
        recolor: recolor
    }
});
/*
var roads = new ol.layer.Tile({
  extent: ol.proj.transformExtent([-20, 35, 30, 55], 'EPSG:4326', 'EPSG:3857'),
  source: tilesource
})
*/
var roads = new ol.layer.Image({
    extent: ol.proj.transformExtent([-20, 35, 30, 55], 'EPSG:4326', 'EPSG:3857'),
    source: roads_raster
});
var baselayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        attributions: ['&copy; DLR/EOC'],
        url: 'https://geoservice.dlr.de/eoc/basemap/wms',
        params: {
            'LAYERS': 'litemap',
        }
    })
});
// Create the map, the view is centered on the triangle. Zooming and panning is
// restricted to a sane area
var map = new ol.Map({
    layers: [
        baselayer,
        roads,
    ],
    target: 'map',
    view: new ol.View({
        center: ol.proj.transform([0, 45], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
    })
});
var layerOnOff = function (event) {
    var layer;
    if (this.id == 'affect-roads') {
        layer = roads;
    }
    console.log(layer.setVisible(!layer.getVisible()));
};
// Get the form elements and bind the listeners
var select = document.getElementById('blend-mode');
var check_roads = document.getElementById('affect-roads');
check_roads.addEventListener('click', layerOnOff);
console.log('start value', select.value);
// Rerender map when blend mode changes
select.addEventListener('change', function () {
    map.render();
});
