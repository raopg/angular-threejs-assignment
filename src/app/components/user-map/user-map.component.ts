import { Component, OnInit, Input } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { defaults as defaultControls } from 'ol/control';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'app-user-map',
  inputs: ['coordinates'],
  templateUrl: './user-map.component.html',
  styleUrls: ['./user-map.component.scss'],
})
export class UserMapComponent implements OnInit {
  @Input('coordinates') coordinates: string;
  map: Map;
  lat: string;
  long: string;

  constructor() {}

  ngOnInit(): void {
    /* Parse lat and long */
    [this.lat, this.long] = this.coordinates.trim().split(',');
    this.lat = this.lat.trim();
    this.long = this.long.trim();

    /* Create Marker style*/
    const markerStyle: Style = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        opaque: 0.75,
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: './assets/icon.png',
      }),
    });

    /* Create marker feature */
    const markerFeature: Feature = new Feature({
      geometry: new Point(fromLonLat([+this.long, +this.lat])),
      name: 'Where I live',
    });

    /* Set the marker style for marker feature */
    markerFeature.setStyle(markerStyle);

    this.map = new Map({
      target: 'map',
      controls: defaultControls({ attribution: false }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [markerFeature],
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([+this.long, +this.lat]),
        zoom: 8,
      }),
    });
  }
}
