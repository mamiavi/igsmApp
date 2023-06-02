import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRange, ModalController } from '@ionic/angular';
import { Howl } from 'howler';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {

  player:Howl;
  isPlaying:boolean = false;
  progress:number = 0;
  audioEnd:boolean = false;

  @ViewChild('range', {static: false}) range: IonRange;

  constructor(private modalCtrl: ModalController, private api: ApiService, private data: DataService) { }

  name:string;
  question:string;
  image:string;
  audio:string;
  answers:[];

  ngOnInit() {

    this.name = this.data.geojson[this.data.route[this.data.count]]["name"];
    this.question = this.data.geojson[this.data.route[this.data.count]]["question"];
    this.image = this.data.geojson[this.data.route[this.data.count]]["image"];
    this.audio = this.data.geojson[this.data.route[this.data.count]]["audio"];
    this.answers = this.data.geojson[this.data.route[this.data.count]]["answers"];

    this.player = new Howl({
      src: `./assets/audio/${this.audio}`,
      onplay: () => {
        this.isPlaying = true;
        this.updateProgress();
      },
      onend: () => {
        this.audioEnd = true;
      }
    });

  }

  togglePlayer(pause:boolean) {

    this.isPlaying = !pause;
    
    if (pause) {
    
      this.player.pause();
    
    } else {
    
      this.player.play();
    
    }

  }

  updateProgress() {
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }

  seek() {
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }

  checkAnswer(correct:boolean) {
    
    if(correct){

      this.api.addPoint(this.data.code);
      
    }

    this.data.updateStop();

    setTimeout((() => {
      this.modalCtrl.dismiss()
    }), 500);

  }

  getValue(answer: Object): boolean {
    return Object.values(answer)[0];
  }

  getKey(answer: Object): string {
    return Object.keys(answer)[0];
  }

}
