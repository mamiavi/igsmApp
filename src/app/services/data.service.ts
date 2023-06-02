import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {

    this.geojson = [
      { "id": 0, "name": "Torres de Serranos", "audio": "torres_serrano.m4a", "question": "Where was Valencia's moon?", "answers": [ { "The real reason was because the crescent moon shape of the river": true }, { "The reason is because the moon sculpture on the gates of the tower": false }, { "The reason was due to the moon in the arabic invasors flag that could not take the city": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3759983, 39.4791922, 0.0 ] } },
      { "id": 1, "name": "Puerta del Mar", "audio": "puerta_mar.m4a", "question": "What was standing where now is the puerta del mar?", "answers": [ { "The royal palace of Valencia": true }, { "Nothing, was builded the gate in a field": false }, { "The gate of the sea has always been there": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3684873, 39.4720963, 0.0 ] } },
      { "id": 2, "name": "Colón", "audio": "colon.m4a", "question": "How many medieval gates are still visible in the city?", "answers": [ { "0": false }, { "Potato": false }, { "1": false }, {"3": true} ] , "geometry": { "type": "Point", "coordinates": [ -0.3709278, 39.470146199999988, 0.0 ] } },
      { "id": 3, "name": "Portal De La Valldigna", "audio": "valldigna.m4a", "question": "What is the name of the neighborhood where the most important medieval cultures live peacefully?", "answers": [ { "Colón": false }, { "Carmen": true }, { "Valldigna": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3786075, 39.477559, 0.0 ] } },
      { "id": 4, "name": "Calle Serranos", "audio": "serranos.m4a", "question": "In what year did Jaime I took the city of Valencia?", "answers": [ { "1123": false }, { "1453": false }, { "1238": true } ] , "geometry": { "type": "Point", "coordinates": [ -0.376622734649902, 39.478008625269823, 0.0 ] } },
      { "id": 5, "name": "Plaza de Manises", "audio": "manises.m4a", "question": "In what year was the Palace built?", "answers": [ { "1541": false }, { "1421": true }, { "1810": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3765453, 39.4768211, 0.0 ] } },
      { "id": 6, "name": "Fuente del Túria", "audio": "fuente_turia.m4a", "question": "When do the tribunal de les aigües reunite every week?", "answers": [ { "Saturday": true }, { "Sunday": false }, { "Wednesday": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3752762, 39.476482399999988, 0.0 ] } },
      { "id": 7, "name": "Casa Punto de Gancho", "audio": "casa_gancho.m4a", "question": "Who founded valencia near the croché house, more than two thousand years ago?", "answers": [ { "Muslims": false }, { "Romans": true }, { "Medieval Christians": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3742942, 39.475918, 0.0 ] } },
      { "id": 8, "name": "Plaza de la Reina", "audio": "plaza_reina.m4a", "question": "What was the micalet origin?", "answers": [ { "It was a Christian tower": false }, { "it was a tower built in the XX century": false }, { "It was the minaret of the ancient islamic mosque": true }, {"It was a roman defense tower":false} ] , "geometry": { "type": "Point", "coordinates": [ -0.3754669, 39.4746454, 0.0 ] } },
      { "id": 9, "name": "Plaza Redonda", "audio": "plaza_redonda.m4a", "question": "To what direction are the accesses of the square directed?", "answers": [ { "All four cardinal directions": true }, { "North and East": false }, { "South and West": false }, { "North and South": false }] , "geometry": { "type": "Point", "coordinates": [ -0.376527, 39.4736692, 0.0 ] } },
      { "id": 10, "name": "Plaza del Mercado", "audio": "plaza_mercado.m4a", "question": "What are the animals crowding the church and the market?", "answers": [ { "Two eagles": false }, { "An Eagle and a Pigeon": true }, { "A stork and an eagle": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3788134, 39.4741372, 0.0 ] } },
      { "id": 11, "name": "Plaça de Tetuan", "audio": "plaza_tetuan.m4a", "question": "When was the royal palace of Valencia destroyed?", "answers": [ { "1814": false }, { "1810": true }, { "1936": false }, {"1700": false} ] , "geometry": { "type": "Point", "coordinates": [ -0.3697492, 39.4749934, 0.0 ] } },
      { "id": 12, "name": "Plaza del Ayuntamiento", "audio": "ayuntamiento.m4a", "question": "How tall was the tallest fallas monument?", "answers": [ { "31": false }, { "41": true }, { "51": false }, { "21":false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3763622, 39.4698148, 0.0 ] } },
      { "id": 13, "name": "Plaza de Toros de Valencia", "audio": "plaza_toros.m4a", "question": "How many people fit the bullfighting square?", "answers": [ { "8000": false }, { "20000": false }, { "12000": true }, { "14000": false } ] , "geometry": { "type": "Point", "coordinates": [ -0.3761198, 39.4666255, 0.0 ] } }
    ]

  }

  code:string;
  route:number[];
  geojson:any;

  count:number = 1; //Because the index 0 in route corresponds to the starting point

  currentStop:Subject<number> = new Subject<number>();

  updateStop() {

    if(this.count >= 14) {

      console.log('Congrats you have finished!!');

    }

    this.count = this.count + 1;
    this.currentStop.next(this.route[this.count]);
  }

}
