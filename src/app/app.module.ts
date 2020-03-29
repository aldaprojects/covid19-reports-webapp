import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { DataTablesModule } from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HeaderComponent } from './shared/header/header.component';
import { PagesComponent } from './pages/pages.component';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

// sockets
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { WorldComponent } from './pages/world/world.component';
import { CountryComponent } from './pages/country/country.component';
import { UnsubscribeComponent } from './pages/unsubscribe/unsubscribe.component';
const config: SocketIoConfig = {
  url: environment.wsUrl, options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    PagesComponent,
    WorldComponent,
    CountryComponent,
    UnsubscribeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot( config ),
    HttpClientModule,
    ChartsModule,
    DataTablesModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
