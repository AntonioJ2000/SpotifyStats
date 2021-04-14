import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { ApiNodeService } from './services/api-node.service';
import { HTTP } from '@ionic-native/http/ngx';

import { File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, SuperTabsModule.forRoot()],
  providers: [
    HTTP, 
    ApiNodeService,
    File,
    Media,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
