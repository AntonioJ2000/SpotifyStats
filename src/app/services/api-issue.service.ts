import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { issue } from '../model/issue';

@Injectable({
  providedIn: 'root'
})
export class ApiIssueService {

  constructor(private http:HTTP) { }

  public createIssue(issue:issue): Promise<void>{
    const endpoint = environment.endpoint + environment.apiSupport;
    return new Promise((resolve, reject) => {
      if(issue){
        this.http.setDataSerializer('json'); 
        this.http
          .post(endpoint, issue, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      } else{
        reject("User does not exists");
      }
    })
  }

  public getAllIssues():Promise<issue[] | null>{
    return new Promise((resolve, reject) => {
      const endpoint = environment.endpoint + environment.apiSupport;
      this.http.get(endpoint, {}, this.header)
      .then(d=>{
        if(d){
          resolve(JSON.parse(d.data));
        }else{
          resolve(null);
        }
      })
      .catch(err=>reject(err))
    })
  }

  public removeIssue (id:string): Promise<void> {
    const endpoint = environment.endpoint + environment.apiSupport + id;
    return new Promise((resolve, reject) => {
      this.http
        .delete(endpoint, {}, this.header)
        .then(d => {
          resolve();
        })
        .catch(err => reject(err));
    })
  }


  private get header():any{
    return {
      "Access-Control-Allow-Origin": "*",
      "apikey": btoa("spotifystatsapikey")
    }
  }
}
