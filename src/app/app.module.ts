import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageUploadModule } from './components/image-upload/image-upload.module';
import { SymbolGridModule } from './components/symbol-grid/symbol-grid.module';
import { InputComponent } from './components/input/input.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SymbolGridModule,
    ImageUploadModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
