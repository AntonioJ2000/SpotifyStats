import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiNodeService {

  constructor(private http:HTTP) { }


  public Authorize():Promise<any | null>{
    return new Promise((resolve, reject)=>{
      const endpoint = 'http://localhost:8888/login';
      this.http.get(endpoint,{},this.header)
      .then(d=>{
        if(d){
          console.log(d);
          resolve(JSON.parse(d.data))
        }else{
          resolve(null);
        }
      }).catch(err => reject(err))
    })
  }

  public getToken():Promise<any | null>{
    return new Promise((resolve, reject)=>{
      const endpoint = 'http://localhost:8888/callback';
      this.http.get(endpoint,{},this.header)
      .then(d=>{
        if(d){
          //console.log(d);
          resolve(d)
        }else{
          resolve(null);
        }
      }).catch(err => reject(err))
    })
  }

  private get header():any{
    return {
      'Access-Control-Allow-Origin': '*',
      'Content-Type':'application/json'
    }
  }


}
