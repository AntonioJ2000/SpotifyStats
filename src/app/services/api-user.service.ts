import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { aux_user_filter } from '../model/aux_user_filter';
import { user } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  constructor(private http:HTTP) { }

  /**
   * HTTP request that obtain all users from the database
   * @returns users (Array)
   */
  public getAllUsers():Promise<user[] | null>{
    return new Promise((resolve, reject) => {
      const endpoint = environment.endpoint + environment.apiUser;
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
   * HTTP request that obtain all users from the database without current user
   * @returns users (Array)
   */
   public getUsersWithoutCurrentClient(id:string):Promise<user[] | null>{
    return new Promise((resolve, reject) => {
      const endpoint = environment.endpoint + environment.apiUser + "without/" + id;
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
   * HTTP request that obtain all unfollowed users from the database.
   * @returns users (Array)
   */
  public getAllUnfollowedUsers(id:string):Promise<user[] | null>{
    return new Promise((resolve, reject) => {
      const endpoint = environment.endpoint + environment.apiUser + "unfollowed/" + id;
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
   * HTTP request that allows the user to find a friend from the database (if not followed)
   * @param filter Two parameters, *id* of the current client just to make sure he does
   * not appear in the list, and *id_filter*, the text from the input
   */
  public getUnfollowedUsersByFilter(filter:aux_user_filter):Promise<user[] | null>{
    return new Promise((resolve, reject) => {
      const endpoint = environment.endpoint + environment.apiUser + "filter";
      this.http.setDataSerializer('json');
      this.http.put(endpoint, filter, this.header)
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
   * HTTP request that creates a new user in the database
   * @param user the user to create
   */
  public createUser(user:user): Promise<void>{
    const endpoint = environment.endpoint + environment.apiUser;
    return new Promise((resolve, reject) => {
      if(user){
        this.http.setServerTrustMode('nocheck');
        this.http.setDataSerializer('json'); 
        this.http
          .post(endpoint, user, this.header)
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
   * HTTP request that gets a user
   * @param id id of the user to obtain
   */
  public getUser(id?:number | string): Promise<user | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiUser;
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
   * HTTP request that removes a user from the database
   * @param user the user to delete
   */
  public removeUser(id:string): Promise<void> {
    const endpoint = environment.endpoint + environment.apiUser + id;
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
   * HTTP request that removes a user from the database
   * @param user the user to delete
   */
   public removeAllForUser(user:user): Promise<void> {
    const id:any = user.id ? user.id : user;
    const endpoint = environment.endpoint + environment.apiUser + "all/" + id;
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
   * HTTP request that updates a user 
   * @param user the user you want to update
   */
  public updateUser(user: user): Promise<void> {
    const endpoint = environment.endpoint + environment.apiUser;
    return new Promise((resolve, reject) => {
      if(user){
        this.http.setDataSerializer('json');
        this.http
          .put(endpoint, user, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      }else{
        reject("User does not exists");
      }
    })
  }
  
  private get header():any{
    return {
      "Access-Control-Allow-Origin": "*",
      "apikey": btoa("spotifystatsapikey")
    }
  }
}