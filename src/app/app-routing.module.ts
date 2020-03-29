import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { WorldComponent } from './pages/world/world.component';
import { CountryComponent } from './pages/country/country.component';
import { UnsubscribeComponent } from './pages/unsubscribe/unsubscribe.component';


const routes: Routes = [{
  path: '', component: PagesComponent, children : [
    { path: 'global', component: WorldComponent, },
    { path: 'unsubscribe/:token', component: UnsubscribeComponent, },
    { path: 'country/:country', component: CountryComponent },
    { path: '', redirectTo: '/global', pathMatch: 'full' },
    { path: '**', redirectTo: '/global', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
