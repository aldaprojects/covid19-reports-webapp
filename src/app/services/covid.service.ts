import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  constructor(
    private http: HttpClient
  ) { }

  loadingRanking() {
    const url = environment.wsUrl + '/countries';

    return this.http.get( url );
  }

  loadingTotalCases() {
    const url = environment.wsUrl + '/global';

    return this.http.get( url );
  }

  loadingLatestCases() {
    const url = environment.wsUrl + '/cases';

    return this.http.get( url );
  }

  loadingOneCountry( country: string ) {
    const url = environment.wsUrl + '/country?name=' + country;

    return this.http.get( url );
  }

  newSubscription( email: string, country: string ) {
    const url = environment.wsUrl + '/subscription';

    return this.http.post( url, {email, country} );
  }

  unsubscribe( token: string ) {
    const url = environment.wsUrl + '/subscription/cancel';

    return this.http.post( url, { token } );
  }

  soport( email: string, msg: string ) {
    const url = environment.wsUrl + '/soport';

    return this.http.post( url, { email, msg } );
  }

  getAllCountriesName() {
    const url = environment.wsUrl + '/allcountries';

    return this.http.get( url );
  }
}
