import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController, ModalController, AnimationController } from '@ionic/angular';

import { Motion } from '@capacitor/motion';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import OSM from 'ol/source/OSM';

import { fromLonLat, transform } from 'ol/proj';
import { getDistance } from 'ol/sphere';

import Geolocation from 'ol/Geolocation';
import Point from 'ol/geom/Point';

import Feature from 'ol/Feature';
import {Icon, Style} from 'ol/style';

import { Attribution } from 'ol/control';
import { QuizComponent } from 'src/app/components/quiz/quiz.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;

  map: Map;
  positionUser: Feature;
  poi: Feature;

  constructor(private alertController: AlertController, private modalCtrl: ModalController, private animationCtrl: AnimationController, private data: DataService) { }

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
      controls:[new Attribution()]
    });

    
    // Configure the user position

    const iconUser = new Icon({
      src: './assets/imgs/geolocation_marker_heading.png',
      rotateWithView: true
    });

    const stylePoi = new Style({
      image: new Icon({
        anchor: [670, 200],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: './assets/imgs/poi.png'
      }),
    });

    const stylePositionUser = new Style({
        image: iconUser
    });

    this.positionUser = new Feature();
    this.poi = new Feature();

    this.poi.setGeometry(new Point(fromLonLat(this.data.geojson[this.data.route[this.data.count]]["geometry"]["coordinates"])));

    this.data.currentStop.subscribe((stop) => {
      this.poi.setGeometry(new Point(fromLonLat(this.data.geojson[stop]["geometry"]["coordinates"])));
    });

    stylePositionUser.setImage(iconUser);
    this.positionUser.setStyle(stylePositionUser);

    this.poi.setStyle(stylePoi)


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

      // check distance
      if(this.checkDistance(this.positionUser, this.poi)) {
        
        this.poi.setGeometry(new Point([0,0]));

        //Open an alert to start the quiz
        this.alertController.create({
          header:'Alert',
          subHeader:`Just arrived to ${this.data.geojson[this.data.route[this.data.count]]["name"]}`,
          message:'Do you want to know more about it?',
          buttons: [{
            text:'OK',
            role:'confirm',
            handler: () => {

              this.showQuizModal();

            }
          }],
          backdropDismiss: false
        }).then((alert) => alert.present());

      }

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
        features: [this.positionUser, this.poi],
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

  public checkDistance(userPosition: Feature, poi: Feature) {

    const tolerance = 30 //meters

    let userGeom = <Point>userPosition.getGeometry()?.clone().transform('EPSG:3857','EPSG:4326');
    let stopGeom = <Point>poi?.getGeometry()?.clone().transform('EPSG:3857','EPSG:4326');

    let distance = getDistance(userGeom.getCoordinates(), stopGeom.getCoordinates());

    if(distance <= tolerance){

      return true;

    } else {

      return false;
    
    }

  }

  public close() {
    this.modal.dismiss();
  }

  public showQuizModal() {

    this.modalCtrl.create({
      component: QuizComponent,
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      backdropDismiss: false,
    }).then(modal => modal.present());
    
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };
}
