import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRange, ModalController } from '@ionic/angular';
import { Howl } from 'howler';

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

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {

    this.player = new Howl({
      src: './assets/audio/clearday.mp3',
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

      console.log('note a correct answer for the team');

    } else {

      console.log('do literally nothing');

    }

    setTimeout((() => {
      this.modalCtrl.dismiss()
    }), 500);

  }

}
