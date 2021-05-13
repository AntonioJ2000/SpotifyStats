import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { friend } from '../model/friend';
import { user } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class ApiFriendService {

  constructor(private http:HTTP) { }


  /**
   * HTTP request that obtain all friends from the database
   * @returns friends (Array)
   */
   public getAllFriends():Promise<friend[] | null>{
    return new Promise((resolve, reject) => {
      const endpoint = environment.endpoint + environment.apiFriend;
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

  /**
   * HTTP request that creates a new friend in the database
   * @param friend the friend to create
   */
  public createFriend(friend:friend): Promise<void>{
    const endpoint = environment.endpoint + environment.apiFriend;
    return new Promise((resolve, reject) => {
      if(friend){
        this.http.setDataSerializer('json'); 
        this.http
          .post(endpoint, friend, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      } else{
        reject("User does not exists");
      }
    })
  }

  /**
   * HTTP request that gets a friend
   * @param id id of the friend to obtain
   */
  public getFriend(id?:number | string): Promise<friend | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiFriend;
      if(id){
        endpoint+=id;
      }
      this.http
        .get(endpoint, {}, this.header)
        .then(d => {
          if(d){
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        })
        .catch(err => reject(err));
    })
  }
 
  /**
   * HTTP request that removes a friend from the database
   * @param friend the friend to delete
   */
  public removeFriend(friend:friend): Promise<void> {
    const id:any = friend.id ? friend.id : friend;
    const endpoint = environment.endpoint + environment.apiFriend + id;
    return new Promise((resolve, reject) => {
      this.http
        .delete(endpoint, {}, this.header)
        .then(d => {
          resolve();
        })
        .catch(err => reject(err));
    })
  }

  /**
   * HTTP request that updates a friend 
   * @param friend the friend you want to update
   */
  public updateFriend(friend: friend): Promise<void> {
    const endpoint = environment.endpoint + environment.apiFriend;
    return new Promise((resolve, reject) => {
      if(friend){
        this.http.setDataSerializer('json');
        this.http
          .put(endpoint, friend, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      }else{
        reject("User does not exists");
      }
    })
  }

  public getFriendsByUser(id?:number | string): Promise<user[] | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiFriend + environment.apiUser;
      if(id){
        endpoint+=id;
      }
      this.http
        .get(endpoint, {}, this.header)
        .then(d => {
          if(d){
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        })
        .catch(err => reject(err));
    })
  }
  
  private get header():any{
    return {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  }
}
