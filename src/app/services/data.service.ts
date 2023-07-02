import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage: StorageService, private toastCtrl: ToastController) {

    this.geojson = [
      { "id": 0, "name": "Torres de Serranos", "audio": "torres_serrano.aac", "image":"torres_serranos.jpg", "question": "Where was Valencia's moon?", "answers": [ { "The real reason was because the crescent moon shape of the river": true }, { "The reason is because the moon sculpture on the gates of the tower": false }, { "The reason was due to the moon in the arabic invasors flag that could not take the city": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.375963292075909, 39.479322175683201, 0.0 ] } },
      { "id": 1, "name": "Puerta del Mar", "audio": "puerta_mar.m4a", "image":"porta_mar.jpg", "question": "What was standing where now is the puerta del mar?", "answers": [ { "The royal palace of Valencia": true }, { "Nothing, it was built on a field": false }, { "The gate of the sea has always been there": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.368810669102215, 39.47221931666224, 0.0 ] } },
      { "id": 2, "name": "Colón", "audio": "colon.m4a", "image":"colon.jpg", "question": "How many medieval gates are still visible in the city?", "answers": [ { "0": false }, { "Potato": false }, { "1": false }, {"3": true} ] , "geometry": { "type": "Point", "coordinates": [ -0.3709278, 39.470146199999988, 0.0 ] } },
      { "id": 3, "name": "Portal De La Valldigna", "audio": "valldigna.m4a", "image":"valldigna.jpg", "question": "What is the name of the neighborhood where the most important medieval cultures live peacefully?", "answers": [ { "Colón": false }, { "Carmen": true }, { "Valldigna": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3786075, 39.477559, 0.0 ] } },
      { "id": 4, "name": "Calle Serranos", "audio": "serranos.aac", "image":"serranos.jpg", "question": "In which year did Jaime I took the city of Valencia?", "answers": [ { "1123": false }, { "1453": false }, { "1238": true } ] , "geometry": { "type": "Point", "coordinates": [ -0.376622734649902, 39.478008625269823, 0.0 ] } },
      { "id": 5, "name": "Plaza de Manises", "audio": "manises.m4a", "image":"plaza_manises.jpg", "question": "In what year was the Palace built?", "answers": [ { "1541": false }, { "1421": true }, { "1810": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.376592267710345, 39.476878622910945, 0.0 ] } },
      { "id": 6, "name": "Fuente del Túria", "audio": "fuente_turia.m4a", "image":"fuente_turia.jpg", "question": "When do the tribunal de les aigües reunite every week?", "answers": [ { "Thursday": true }, { "Sunday": false }, { "Wednesday": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.375279286584046, 39.476383983295925, 0.0 ] } },
      { "id": 7, "name": "Casa Punto de Gancho", "audio": "casa_gancho.aac", "image":"casa_gancho.jpg", "question": "How many years have passed since the foundation of Valencia by the romans?", "answers": [ { "1885": false }, { "2161": true }, { "1884": false }, { "It wasn't fund by the romans": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.374372702697458, 39.475911442023886, 0.0 ] } },
      { "id": 8, "name": "Plaza de la Reina", "audio": "plaza_reina.aac", "image":"plaza_reina.jpg", "question": "How high is the Micalet?", "answers": [ { "207 meters": false }, { "104 meters": false }, { "63 meters": true }, {"51 meters, same as its perimeter":false} ] , "geometry": { "type": "Point", "coordinates": [ -0.3754669, 39.4746454, 0.0 ] } },
      { "id": 9, "name": "Plaza Redonda", "audio": "plaza_redonda.aac", "image":"plaza_redonda.jpg", "question": "How much does the square measures in diameter?", "answers": [ { "37 meters": true }, { "30 meters": false }, { "40 meters": false }, { "107 cm": false }] , "geometry": { "type": "Point", "coordinates": [ -0.376527, 39.4736692, 0.0 ] } },
      { "id": 10, "name": "Plaza del Mercado", "audio": "plaza_mercado.m4a", "image":"plaza_mercado.jpg", "question": "What are the animals crowding the church and the market?", "answers": [ { "Two eagles": false }, { "An Eagle and a Pigeon": true }, { "A stork and an eagle": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3788134, 39.4741372, 0.0 ] } },
      { "id": 11, "name": "Plaça de Tetuan", "audio": "plaza_tetuan.m4a", "image":"plaza_tetuan.jpg", "question": "When was the royal palace of Valencia destroyed?", "answers": [ { "1814": false }, { "1810": true }, { "1936": false }, {"1700": false} ] , "geometry": { "type": "Point", "coordinates": [ -0.3697492, 39.4749934, 0.0 ] } },
      { "id": 12, "name": "Plaza del Ayuntamiento", "audio": "ayuntamiento.m4a", "image":"ayuntamiento.jpg", "question": "How tall was the tallest fallas monument?", "answers": [ { "31": false }, { "41": true }, { "51": false }, { "21":false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3763622, 39.4698148, 0.0 ] } },
      { "id": 13, "name": "Plaza de Toros de Valencia", "audio": "plaza_toros.m4a", "image":"plaza_toros.jpeg", "question": "How many people fit the bullfighting square?", "answers": [ { "8000": false }, { "20000": false }, { "12000": true }, { "14000": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.375965194652662, 39.467078137888684, 0.0 ] } }
    ]

  }

  code:string;
  route:number[];
  geojson:any;

  count:number = 1; //Because the index 0 in route corresponds to the starting point

  currentStop:Subject<number> = new Subject<number>();

  updateStop() {

    if(this.count >= 14) {

      this.toastCtrl.create({
        message: 'Congrats you have finished!!',
        duration: 2000,
        position: 'middle'
      }).then(toast => toast.present());

      this.storage.remove('group_code');

    }

    this.count++;
    this.currentStop.next(this.route[this.count]);
    this.storage.set('count', this.count);
  }

}
