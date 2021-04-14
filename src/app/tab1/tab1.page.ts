import { Component } from '@angular/core';
import { ApiNodeService } from '../services/api-node.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private apiNode:ApiNodeService) {}

  public async login(){
    const d = await this.apiNode.Authorize();
    console.log(d);
  }
}
