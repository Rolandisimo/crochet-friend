import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ImageUploadModule } from './components/image-upload/image-upload.module';
import { InputComponent } from './components/input/input.component';
import { SymbolGridModule } from './components/symbol-grid/symbol-grid.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  declarations: [AppComponent, InputComponent, ToolbarComponent],
  imports: [BrowserModule, AppRoutingModule, SymbolGridModule, ImageUploadModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
