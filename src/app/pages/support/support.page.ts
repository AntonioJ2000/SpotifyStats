import { Component } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { issue } from 'src/app/model/issue';
import { ApiIssueService } from 'src/app/services/api-issue.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage {

  reportList:issue[] = [];

  noReports:boolean = false;

  constructor(private navCtrl:NavController,
              private apiIssue:ApiIssueService,
              private loading:LoadingService,
              private alertController:AlertController,
              private toastController:ToastController) { }

  /**
   * Gets all the reports from the database every time the developer enters this screen. 
   */
  async ionViewWillEnter() {
    this.loading.cargarLoading();

    try{
      await this.getAllReports().then(()=>{
        if(this.reportList.length==0){
          this.noReports = true;
        }
        setTimeout(() => {
          this.loading.pararLoading();
        }, 750);
      })
    }catch{
      this.noReports = true;
      setTimeout(() => {
        this.loading.pararLoading();
      }, 750); 
    }
  }

  closeSupportPage(){
    this.navCtrl.navigateBack(['/tabs/tab3'])
  }

  /**
   * gets all the reports from the database
   */
  async getAllReports(){
    this.reportList = await this.apiIssue.getAllIssues();
  }

  /**
   * Confirmation to delete a report.
   * @param id id of the selected report.
   */
  public async confirmDeleteReport(id:any){
    const alert = await this.alertController.create({
      cssClass: 'deleteNote',
      header: "Borrar rutina",
      message: "¿Está usted seguro de que desea borrar la rutina?",
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          cssClass: 'alertOK',
          handler: () => {
            //No hacemos nada
          }
        }, {
          text: "Borrar",
          cssClass: 'alertDELETE',
          handler: () => {
            this.deleteSelectedReport(id);
          }
        },
      ]
    });

    await alert.present();
  }

  /**
   * Allows the developer to delete any report.
   * @param id id of the selected report.
   */
  async deleteSelectedReport(id:any){
    try{
      await this.apiIssue.removeIssue(id).then(async()=>{
        await this.reloadReportList().then(()=>{
          this.loading.pararLoading();
        })
        
      });
    }catch{
      console.log("Ha ocurrido un error al borrar el reporte");
      this.reportErrorToast();
    }
    

  }

  /**
   * Reload the report list.
   */
  async reloadReportList(){
    this.loading.cargarLoading();
    try{
      await this.getAllReports().then(()=>{
        if(this.reportList.length==0){
          this.noReports = true;
        }
        setTimeout(() => {
          this.loading.pararLoading();
        }, 750);
      })
    }catch{
      this.noReports = true;
      setTimeout(() => {
        this.loading.pararLoading();
      }, 750); 
    }
  }

  private async reportErrorToast(){
    const toast = await this.toastController.create({
      cssClass: 'myToastError',
      message: 'Ha ocurrido un error en el eliminado del reporte, inténtalo más tarde',
      duration: 2000,
      position:"bottom"
    });
    toast.present();
  }
}
