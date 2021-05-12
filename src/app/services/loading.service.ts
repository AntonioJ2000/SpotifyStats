import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingActivo:boolean = false;

  constructor(public loadingController: LoadingController) { }

  /**
   * Function that represent the loading with a custom git
   */
  public async cargarLoading() {
    if(!this.loadingActivo){
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: '<ion-img src="/assets/stats_loading.gif" class="stats-loading" alt="loading..."></ion-img>',
        spinner: null
      });
      await loading.present();
      this.loadingActivo = true;
    }
  }

  /**
   * Function that stop the loading previously created
   */
  public async pararLoading(){
    await this.loadingController.dismiss();
    this.loadingActivo = false;
  }

  /**
   * Function that loads a normal backdrop loading. Used only in the profile (Tab3).
   */
  public async cargarLoadingOscuro(){
    if(!this.loadingActivo){
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        spinner: null
      });
      await loading.present();
      this.loadingActivo = true;
    }
  }
}
