import { Component, OnInit, Input } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { Control, defaults as defaultControls } from 'ol/control';

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

    this.map = new Map({
      target: 'map',
      controls: defaultControls({ attribution: false }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([+this.long, +this.lat]),
        zoom: 5,
      }),
    });
  }
}
