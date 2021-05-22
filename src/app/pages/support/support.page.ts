import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
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
              private loading:LoadingService) { }

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

  async getAllReports(){
    this.reportList = await this.apiIssue.getAllIssues();
  }

  deleteSelectedReport(){

  }

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
}
