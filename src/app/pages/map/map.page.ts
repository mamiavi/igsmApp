import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController, ModalController, AnimationController } from '@ionic/angular';

import { Motion } from '@capacitor/motion';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import OSM from 'ol/source/OSM';

import { transform } from 'ol/proj';
import { getDistance } from 'ol/sphere';

import Geolocation from 'ol/Geolocation';
import Point from 'ol/geom/Point';

import Feature from 'ol/Feature';
import {Icon, Style} from 'ol/style';

import { Attribution } from 'ol/control';
import { QuizComponent } from 'src/app/components/quiz/quiz.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;

  map: Map;
  positionUser: Feature;
  nextStop: Feature;

  constructor(private alertController: AlertController, private modalCtrl: ModalController, private animationCtrl: AnimationController) { }

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

    const stylePositionUser = new Style({
        image: iconUser
    });

    this.positionUser = new Feature();

    stylePositionUser.setImage(iconUser);
    this.positionUser.setStyle(stylePositionUser);


    // Start geolocation
    const geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: this.map.getView().getProjection(),
    });

    geolocation.setTracking(true);

    let mierda = true;

    geolocation.on('change:position', () => {
      const coordinates = geolocation.getPosition();
      this.positionUser.setGeometry(coordinates ? new Point(coordinates) : undefined);

      // check distance
      if(this.checkDistance(this.positionUser, this.nextStop) || mierda) {
        
        // Prevent multiple alerts
        mierda = false;

        //Open an alert to start the quiz
        this.alertController.create({
          header:'Alert',
          subHeader:'Just arrived to {Monumento}',
          message:'Do you want to know more about it?',
          buttons: [{
            text:'OK',
            role:'confirm',
            handler: () => {
              // change to next stop
              
              // open the modal with the audio
              this.showQuizModal();

            }
          }],
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

  public checkDistance(userPosition: Feature, nextStop: Feature) {

    const tolerance = 30 //meters

    let userGeom = <Point>userPosition.getGeometry()?.clone().transform('EPSG:3857','EPSG:4326');
    let stopGeom = <Point>nextStop?.getGeometry()?.clone().transform('EPSG:3857','EPSG:4326');

    //let distance = getDistance(userGeom.getCoordinates(), stopGeom.getCoordinates());

    let distance = 1000;

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
