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

  constructor(private navCtrl:NavController,
              private apiIssue:ApiIssueService,
              private loading:LoadingService) { }

  async ionViewWillEnter() {
    this.loading.cargarLoading();
      await this.getAllReports().then(()=>{
        this.loading.pararLoading();
      })
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
      await this.getAllReports().then(()=>{
        this.loading.pararLoading();
      })
  }

}
