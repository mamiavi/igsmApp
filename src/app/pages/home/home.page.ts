import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Platform, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  code:string;
  groups: any = {};

  constructor(private router:Router, private platform: Platform, private api:ApiService, private storage: StorageService, private toastController: ToastController, private dataService: DataService) { }

  ngOnInit() {

    this.api.getGroups().then(response => {
      
      response.data.groups.forEach((group: {id:number, code: string, points:number, devices:number, route:string }) => {
        this.groups[group.code] = group.route.split(';').map(Number);
      });

    }).catch(err => console.log(err));

    this.platform.pause.subscribe(() => {
      this.storage.set('count', this.dataService.count);
    });

  }

  public logIn() {

    if(Object.keys(this.groups).includes(this.code)) {
      
      this.dataService.code = this.code;
      this.dataService.route = this.groups[this.code];

      this.storage.set('group_code', this.code);
      this.storage.set('route', this.groups[this.code]);

      this.router.navigate(['/map']);
    
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
