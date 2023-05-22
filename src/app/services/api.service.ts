import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '@capacitor-community/http';
import { HttpOptions } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //url:string = 'https://mmv-gis.ml/'
  //url:string = 'http://192.168.0.14:8000/igsm_api/groups/'
  url:string = 'http://127.0.0.1:8000/igsm_api/groups/'

  constructor() { }

  public getGroups() {

    const options: HttpOptions = {
      url:this.url,
    }

    return Http.get(options);

  }

  public addPoint(code:string) {

    const options: HttpOptions = {
      url:this.url + code,
    }

    return Http.put(options)

  }

}
