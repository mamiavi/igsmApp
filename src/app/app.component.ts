import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storage: StorageService, private router: Router, private data: DataService) {}

  ngOnInit() {

    this.storage.init().then(() => {

      this.storage.get('group_code')?.then(code => {

        if (code == null) {

          this.router.navigate(['/home']);

        } else {

          this.storage.get('route')?.then((route) => {

            this.storage.get('count')?.then((count) => {

              this.data.code = code;
              this.data.route = route;
              this.data.count = count;
  
              this.router.navigate(['/map']);

            });

          });
        }
  
      });

    });
    
  }

}
