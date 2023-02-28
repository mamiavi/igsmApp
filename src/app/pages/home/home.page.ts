import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  codes: string[] = [];
  code:string;

  constructor(private router:Router, private api:ApiService, private toastController: ToastController) { }

  ngOnInit() {

    this.api.getGroups().then(response => {
      
      response.data.groups.forEach((group: {id:number, code: string, points:number }) => {
        
        this.codes.push(group.code);
      
      });

    });

  }

  public logIn() {

    //Check the password given


    if(this.codes.includes(this.code)) {
      
      this.router.navigate(['map']);
    
    } else {
      
      this.toastController.create({
        message: 'Please, enter a valid code',
        duration: 1500,
        position: 'bottom',
        animated: true,
        translucent: true,
        color: 'danger'
      }).then(toast => toast.present());

    }
    

  
  }

}
