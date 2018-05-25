var redLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [new ol.Feature(new ol.geom.Point([0, 0]))]
  }),
  style: new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.8)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgb(255,0,0)',
        width: 15
      }),
      radius: 120
    })
  })
});

var roads = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    attributions: ['&copy; DLR/EOC'],
    url: 'https://geoservice.dlr.de/eoc/basemap/wms',
    params: {
      'LAYERS': 'baselayer:baselayer_roads_gen3', //basemap baselayer:baselayer_roads_gen3,baselayer:baselayer_roads_gen4
    }
  })
})

var roads = new ol.layer.Tile({
  //xmin,ymin,xmax,ymax
  extent: ol.proj.transformExtent([-20, 35, 30, 55], 'EPSG:4326', 'EPSG:3857'),
  source: new ol.source.TileWMS({
    attributions: ['&copy; DLR/EOC'],
    url: 'https://geoservice.dlr.de/eoc/basemap/wms',
    params: {
      'LAYERS': 'osm_roads_gen3',
    }
  })
})

var relief = new ol.layer.Tile({
  extent: ol.proj.transformExtent([-20, 35, 30, 55], 'EPSG:4326', 'EPSG:3857'),
  source: new ol.source.TileWMS({
    attributions: ['&copy; DLR/EOC'],
    url: 'https://geoservice.dlr.de/eoc/basemap/wms',
    params: {
      'LAYERS': 'eoc:world_relief_bw',
    }
  })
})



var baselayer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    attributions: ['&copy; DLR/EOC'],
    url: 'https://geoservice.dlr.de/eoc/basemap/wms',
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
    relief,
    roads,
  ],
  target: 'map',
  view: new ol.View({
    center: ol.proj.transform([0, 45], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  })
});


var layerOnOff = function (event) {
  var layer: ol.layer.Base;
  if (this.id == 'affect-roads') {
    layer = roads;
  } else if (this.id == 'affect-relief') {
    layer = relief;
  }
  console.log(layer.setVisible(!layer.getVisible()));
}

// Get the form elements and bind the listeners
var select = <HTMLInputElement>document.getElementById('blend-mode');
var check_roads = document.getElementById('affect-roads');
var check_relief = document.getElementById('affect-relief');
check_roads.addEventListener('click', layerOnOff);
check_relief.addEventListener('click', layerOnOff);
console.log('start value', select.value)


roads.on('precompose', (event: ol.render.Event) => {
  var ctx = event.context;
  ctx.save();
  ctx.globalCompositeOperation = select.value;
});


roads.on('postcompose', (event: ol.render.Event) => {
  var ctx = event.context;
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
});



// Rerender map when blend mode changes
select.addEventListener('change', () => {
  map.render();
});

