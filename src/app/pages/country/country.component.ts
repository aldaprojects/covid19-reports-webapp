import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CovidService } from '../../services/covid.service';
import { WebsocketService } from '../../services/websocket.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import {NgForm} from '@angular/forms';
import { Label, Color } from 'ng2-charts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit, OnDestroy {

  public lineChartDataLine: ChartDataSets[] = [
    { data: [], label: 'Casos' },
    { data: [], label: 'Posibles casos futuros' },
  ];

  public lineChartDataBar: ChartDataSets[] = [
    { data: [], label: 'Casos' }
  ];

  public lineChartLabelsLine: Label[] = [
  ];

  public lineChartLabelsBar: Label[] = [
  ];

  public lineChartOptions: (ChartOptions) = {
    legend: {
      display: true
    }
  };

  public countries: object;

  public lineChartColors: Color[] = [
    { // blue
      backgroundColor: 'rgba(0, 123, 255, 0.3)',
      borderColor: '#007bff',
      pointBackgroundColor: 'black',
      pointBorderColor: 'black',
    },
    { // red
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      borderColor: 'rgba(255, 0, 0, 0.7)',
      pointBackgroundColor: 'black',
      pointBorderColor: 'black',
    }
  ];

  fCases = {
    cases: 0,
    date: ''
  };

  countryName: string;
  country: any = {
    cases: 0,
    total_recovered: 0,
    deaths: 0
  };
  recovered: any = 0.0;
  deaths: any = 0.0;

  csLoadingOneCountry: Subscription;
  csGetAllCountriesName: Subscription;
  wsLoadingOneCountry: Subscription;

  constructor(public router: Router,
              public csService: CovidService,
              public wsService: WebsocketService) { }

  ngOnInit() {
    this.countryName = decodeURI(this.router.url.split('/')[2]);

    this.csLoadingOneCountry = this.csService.loadingOneCountry( this.countryName )
    .subscribe( (data: any) => {
      if ( data.ok ) {
        this.updateData(data.country);
      }
    });

    this.wsLoadingOneCountry = this.wsService.listen(`country${this.countryName}`)
    .subscribe( (data: any) => {
      this.updateData(data);
    });

    this.csGetAllCountriesName = this.csService.getAllCountriesName()
    .subscribe((data: any) => {
      this.countries = data.countries;
    });

  }

  ngOnDestroy() {
    // this.csLoadingOneCountry.unsubscribe();
    // this.csGetAllCountriesName.unsubscribe();
    // this.wsLoadingOneCountry.unsubscribe();
  }

  updateData( data: any ) {

    this.country = data;
    this.recovered = (this.country.total_recovered * 100 / this.country.cases).toFixed(2);
    this.deaths = (this.country.deaths * 100 / this.country.cases).toFixed(2);

    let date = new Date('2020-03-18');
    let day = 17;
    const actualData = [];
    const futureData = [];

    const casesPerDay = [];

    const labels = [];
    // tslint:disable-next-line: prefer-for-of
    for ( let i = 0; i < this.country.last_updates.length; i++ ) {
      date = new Date(date.setDate(day++));
      labels.push(date.toLocaleDateString());
      this.lineChartLabelsBar.push(date.toLocaleDateString());
      actualData.push(this.country.last_updates[i].cases);
      futureData.push(this.country.last_updates[i].cases);
      if ( i + 1 < this.country.last_updates.length ) {
        casesPerDay.push(this.country.last_updates[i + 1].cases - this.country.last_updates[i].cases);
      }
    }

    this.lineChartDataLine[0].data = actualData;

    this.fCases.cases = this.country.future_cases[0].cases;
    this.fCases.date = new Date(date.setDate(day)).toLocaleDateString();

    // tslint:disable-next-line: prefer-for-of
    for ( let i = 0; i < this.country.future_cases.length; i++ ) {
      date = new Date(date.setDate(day++));
      labels.push(date.toLocaleDateString());
      futureData.push(this.country.future_cases[i].cases);
    }

    this.lineChartDataLine[1].data = futureData;
    this.lineChartDataBar[0].data = casesPerDay;

    labels.pop();

    this.lineChartLabelsLine = labels;
    this.lineChartLabelsBar.splice(0 , 1);
  }

  compare( country: string ) {

    if ( this.lineChartDataLine[0].label === 'Casos' ) {
      const actualCountry = this.lineChartDataLine[0];
      actualCountry.label = this.countryName;

      this.lineChartDataLine.pop();
      this.lineChartDataLine[0] = actualCountry;

      for ( let i = 0; i < 4; i++ ) {
        this.lineChartLabelsLine.pop();
      }
    }

    if ( this.lineChartDataLine.length > 1 ) {
      this.lineChartDataLine.pop();
    }

    this.csLoadingOneCountry = this.csService.loadingOneCountry( country )
    .subscribe( (data: any) => {
      if ( data.ok ) {
        // tslint:disable-next-line: no-shadowed-variable
        const country = data.country;

        const actualData = [];

        // tslint:disable-next-line: prefer-for-of
        for ( let i = 0; i < country.last_updates.length; i++ ) {
          actualData.push(country.last_updates[i].cases);
        }

        const newData = {
          data: actualData, label: country.country_name
        };

        this.lineChartDataLine.push(newData);

        const color = [{ // blue
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          borderColor: '#007bff',
          pointBackgroundColor: 'black',
          pointBorderColor: 'black',
        },
        { // red
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          borderColor: 'rgba(255, 0, 0, 0.7)',
          pointBackgroundColor: 'black',
          pointBorderColor: 'black',
        }];

        this.lineChartColors = color;
      }
    });

  }

  subscription( forma: NgForm ) {
    this.csService.newSubscription( forma.value.email, this.countryName )
    .subscribe( (data) => {
      document.getElementById('emailCampo').innerHTML =
      `
        <div class="text-center alert alert-success" role="alert">
          Ahora te llegarán reportes a tu correo
          <i class="fas fa-check"></i>
        </div>
      `;
    }
    );
  }

}
