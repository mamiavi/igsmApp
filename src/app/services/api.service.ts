import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { HttpOptions } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //url:string = 'https://mmv-gis.ml/'
  //url:string = 'http://192.168.0.14:8000/igsm_api/groups/'
  // url:string = 'http://127.0.0.1:8000/igsm_api/groups/'
  url:string = 'http://81.202.12.40/igsm_api'

  constructor() { }

  public getGroups() {

    let endPoint = 'groups';

    const options: HttpOptions = {
      url:this.url + '/' + endPoint,
    }

    return Http.get(options);

  }

  public addPoint(code:string) {

    let endPoint = 'add_point';

    const options: HttpOptions = {
      url:this.url + '/' + endPoint + '/' + code,
    }

    return Http.put(options)

  }

  public addDevice(code:string) {

    let endPoint = 'add_device';

    const options: HttpOptions = {
      url:this.url + '/' + endPoint + '/' + code
    }

  }

}
