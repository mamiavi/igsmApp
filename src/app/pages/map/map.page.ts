import { Component, OnInit } from '@angular/core';

import { Motion } from '@capacitor/motion';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import OSM from 'ol/source/OSM';

import { transform } from 'ol/proj';

import Geolocation from 'ol/Geolocation';
import Point from 'ol/geom/Point';

import Feature from 'ol/Feature';
import {Icon, Style} from 'ol/style';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: Map;
  positionUser: Feature;

  constructor() { }

  ngOnInit() {

    // Init the map
    this.map = new Map({
      view: new View({
        center: transform([-0.365, 39.465], 'EPSG:4326', 'EPSG:3857'),
        zoom: 11,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'ol-map',
      controls:[]
    });

    // Configure the user position
    this.positionUser = new Feature();

    const iconUser = new Icon({
      src: './assets/imgs/geolocation_marker_heading.png',
      rotateWithView: true
    });

    const stylePositionUser = new Style({
        image: iconUser
    });

    // Start geolocation
    const geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: this.map.getView().getProjection(),
    });

    geolocation.setTracking(true);

    geolocation.on('change:position', () => {
      const coordinates = geolocation.getPosition();
      this.positionUser.setGeometry(coordinates ? new Point(coordinates) : undefined);
    });

    Motion.addListener('orientation', event => {
      var heading = event.alpha;

      iconUser.setRotation(-heading * (Math.PI/180));
      
      stylePositionUser.setImage(iconUser);
      this.positionUser.setStyle(stylePositionUser);
    
    });

    new VectorLayer({
      map: this.map,
      source: new VectorSource({
        features: [this.positionUser],
      }),
    });

  }

  public centerView() {

    let location = <Point>this.positionUser.getGeometry();
  
    let lon = location.getCoordinates()[0];
    let lat = location.getCoordinates()[1];

    this.map.getView().animate({
      center: [lon,lat],
      zoom: 15
    });

  }

}
