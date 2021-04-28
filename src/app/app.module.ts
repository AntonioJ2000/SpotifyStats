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
import { SpotifyAuth } from '@ionic-native/spotify-auth/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, SuperTabsModule.forRoot()],
  providers: [
    HTTP, 
    ApiNodeService,
    File,
    Media,
    MediaCapture,
    SpotifyAuth,
    AuthService,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
