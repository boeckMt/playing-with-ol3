var color = [170, 211, 223, 255];
var recolor = function(pixel, data) {
  // 0 - 255
  //console.log(data)
  let [r, g, b, a] = pixel;
  let color = data.color;
  if (color[0] == pixel[0]) {
    let [r2, g2, b2, a2] =  color;
    //r = r2; g = g2; b = b2;
    r = 0; g = 0; b = 0; a = 0;
  } else {
    //r = 0; g = 0; b =0; a = 0;
  }

  return [r, g, b, a];
}
//https://a.tile.openstreetmap.org/2/2/1.png
var tilesource = new ol.source.XYZ({
  url: 'proxy/{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
})

var rastersource = new ol.source.Raster({
  sources: [
    tilesource
  ],
  operation: function(pixels, data) {
    return recolor(pixels[0], data);
  },
  lib: {
    recolor: recolor
  }
});

/*
var rasterlayer = new ol.layer.Tile({
  extent: ol.proj.transformExtent([-20, 35, 30, 55], 'EPSG:4326', 'EPSG:3857'),
  source: tilesource
})
*/



var rasterlayer = new ol.layer.Image({
  extent: ol.proj.transformExtent([-20, 35, 30, 55], 'EPSG:4326', 'EPSG:3857'),
  source: rastersource
})




var baselayer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    attributions: ['&copy; DLR/EOC'],
    url: 'proxy/eoc/basemap/wms',
    params: {
      'LAYERS': 'litemap',
    }
  })
})

// Create the map, the view is centered on the triangle. Zooming and panning is
// restricted to a sane area
var map = new ol.Map({
  layers: [
    baselayer,
    rasterlayer,
  ],
  target: 'map',
  view: new ol.View({
    center: ol.proj.transform([0, 45], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  })
});


var layerOnOff = function(event) {
  var layer: ol.layer.Base;
  if (this.id == 'affect-rasterlayer') {
    layer = rasterlayer;
  }
  //console.log(layer.setVisible(!layer.getVisible()));
}

// Get the form elements and bind the listeners
var check_rasterlayer = document.getElementById('affect-rasterlayer');
check_rasterlayer.addEventListener('click', layerOnOff);


var coordinate;

map.on('click', function(event) {
  coordinate = event.coordinate;
  rastersource.changed();
});


//get color from coordinate
rasterlayer.on('postcompose', function(event) {
  var ctx = event.context;
  var pixelRatio = event.frameState.pixelRatio;
  //console.log(coordinate)
  if (coordinate) {
    let pixel = map.getPixelFromCoordinate(coordinate)
    let x = pixel[0] * pixelRatio;
    let y = pixel[1] * pixelRatio;
    let data = ctx.getImageData(x, y, 1, 1).data;
    color = data;
    //console.log(color)
  }
});

rastersource.on('beforeoperations', function(event) {
  // the event.data object will be passed to operations
  event.data.color = color;
});
