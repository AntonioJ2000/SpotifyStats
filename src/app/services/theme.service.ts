import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  renderer: Renderer2;

  constructor(private rendererFactory:RendererFactory2, @Inject(DOCUMENT) private document: Document) { 
    this.renderer = this.rendererFactory.createRenderer(null,null);
  }

  enableDefault(){
    this.removeAll();
  }

  enableWhite(){
    this.removeAll();
    this.renderer.addClass(this.document.body, 'white-theme');
  }

  enableYellow(){
    this.removeAll();
    this.renderer.addClass(this.document.body, 'yellow-theme');
  }

  enableOrange(){
    this.removeAll();
    this.renderer.addClass(this.document.body, 'orange-theme');
 
  }

  enableRed(){
    this.removeAll();
    this.renderer.addClass(this.document.body, 'red-theme');
 
  }

  enableBlue(){
    this.removeAll();
    this.renderer.addClass(this.document.body, 'blue-theme');
 
  }

  enablePurple(){
    this.removeAll();
    this.renderer.addClass(this.document.body, 'purple-theme');
 
  }

  enableMagenta(){
    this.removeAll();
    this.renderer.addClass(this.document.body, 'magenta-theme');
 
  }

  setThemeOnInit(tema:string){
    this.removeAll();
    this.renderer.addClass(this.document.body, tema);
 
  }

  removeAll(){
    this.renderer.removeClass(this.document.body, 'white-theme');
    this.renderer.removeClass(this.document.body, 'yellow-theme');
    this.renderer.removeClass(this.document.body, 'orange-theme');
    this.renderer.removeClass(this.document.body, 'red-theme');
    this.renderer.removeClass(this.document.body, 'blue-theme');
    this.renderer.removeClass(this.document.body, 'purple-theme');
    this.renderer.removeClass(this.document.body, 'magenta-theme');
  }
}
