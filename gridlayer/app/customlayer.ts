declare var ol: any, turf: any;


/**
 * @classdesc
 * Layer for rendering vector data as a Grid.
 *
 * @constructor
 * @extends {ol.layer.Vector}
 * @fires ol.render.Event
 * @param {olx.layer.GridOptions=} options Options.
 * @api
 */
ol.layer.Grid = function(options: any) {
    var _options = options ? options : {};
    //var baseOptions = ol.obj.assign({}, options);
    var baseOptions = (window as any).Object.assign({},options);
    ol.layer.Vector.call(this, /** @type {olx.layer.VectorOptions} */(baseOptions));
    //drawCell(this)
    this.drawGrid(1)
    this.setStyle(this.style);


};
//ol.inherits(ol.layer.Grid, ol.layer.Vector);
ol.inherits(ol.layer.Grid, ol.layer.Image);

ol.layer.Grid.prototype.drawCell = function(x: number, y: number, radius: number) {
    var x_min = x - radius, x_max = x + radius,
        y_min = y - radius, y_max = y + radius;
    var poly = new ol.geom.Polygon([
        [
            [x_min, y_max], [x_max, y_max], [x_max, y_min], [x_min, y_min], [x_min, y_max]
        ]
    ]);
    return poly;
}

/** draw poly from point */
ol.layer.Grid.prototype.drawGrid = function(cellsize?: number) {
    //var newFeatures = new ol.Collection();
    cellsize = cellsize || 1;
    var radius = (cellsize / 2)
    var source = this.getSource();
    source.forEachFeature((feature) => {
        var _geom = feature.getGeometry();
        //what to do if other type of geom???????
        if (_geom instanceof ol.geom.Point) {
            let coordinates = _geom.getCoordinates();
            let newGeom = this.drawCell(coordinates[0], coordinates[1], radius);
            //drawCell(newGeom.getCoordinates())
            feature.setGeometry(newGeom)
        }
    })
}

ol.layer.Grid.prototype.style = function(feature, resolution) {
/*
  var opacity = 0.8;
    var colors = [
        [254, 240, 217, opacity],
        [253, 212, 158, opacity],
        [253, 187, 132, opacity],
        [252, 141, 89, opacity],
        [227, 74, 51, opacity],
        [179, 0, 0, opacity]
    ]
*/

    var fill = new ol.style.Fill();
    var style = new ol.style.Style({
        fill: fill
    });

    var value = feature.get('value');
    var color = feature.get('color');
    fill.setColor(color);
/*
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
*/
    return style;
}
