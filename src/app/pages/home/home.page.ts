import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  codes: string[] = [];
  code:string;
  route:number[];

  constructor(private router:Router, private api:ApiService, private toastController: ToastController, private dataService: DataService) { }

  ngOnInit() {

    this.api.getGroups().then(response => {
      
      response.data.groups.forEach((group: {id:number, code: string, points:number, devices:number, route:string }) => {
        
        this.codes.push(group.code);
        this.route = group.route.split(';').map(Number);
      
      });

    }).catch(err => console.log(err));

  }

  public logIn() {

    if(this.codes.includes(this.code)) {
      
      this.dataService.code = this.code;
      this.dataService.route = this.route;

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
