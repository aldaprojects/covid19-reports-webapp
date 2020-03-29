import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CovidService } from '../../services/covid.service';
import { WebsocketService } from '../../services/websocket.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import {NgForm} from '@angular/forms';
import { Label, Color } from 'ng2-charts';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Casos' },
    { data: [], label: 'Posibles casos futuros' },
  ];
  public lineChartLabels: Label[] = [
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
    },
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

  constructor(public router: Router,
              public csService: CovidService,
              public wsService: WebsocketService) { }

  ngOnInit() {
    this.countryName = decodeURI(this.router.url.split('/')[2]);
    this.csService.loadingOneCountry( this.countryName )
    .subscribe( (data: any) => {
      if ( data.ok ) {
        this.updateData(data.country);
      }
    });

    this.wsService.listen(`country${this.countryName}`)
    .subscribe( (data: any) => {
      this.updateData(data);
    });

    this.csService.getAllCountriesName()
    .subscribe((data: any) => {
      this.countries = data.countries;
    });

  }

  updateData( data: any ) {

    this.country = data;
    this.recovered = (this.country.total_recovered * 100 / this.country.cases).toFixed(2);
    this.deaths = (this.country.deaths * 100 / this.country.cases).toFixed(2);

    let date = new Date('2020-03-18');
    let day = 17;
    const actualData = [];
    const futureData = [];
    const labels = [];
    // tslint:disable-next-line: prefer-for-of
    for ( let i = 0; i < this.country.last_updates.length; i++ ) {
      date = new Date(date.setDate(day++));
      labels.push(date.toLocaleDateString());
      actualData.push(this.country.last_updates[i].cases);
      futureData.push(this.country.last_updates[i].cases);
    }

    this.lineChartData[0].data = actualData;

    this.fCases.cases = this.country.future_cases[0].cases;
    this.fCases.date = new Date(date.setDate(day)).toLocaleDateString();

    // tslint:disable-next-line: prefer-for-of
    for ( let i = 0; i < this.country.future_cases.length; i++ ) {
      date = new Date(date.setDate(day++));
      labels.push(date.toLocaleDateString());
      futureData.push(this.country.future_cases[i].cases);
    }

    this.lineChartData[1].data = futureData;

    labels.pop();

    this.lineChartLabels = labels;

  }

  compare( country: string ) {

    if ( this.lineChartData[0].label === 'Casos' ) {
      const actualCountry = this.lineChartData[0];
      actualCountry.label = this.countryName;

      this.lineChartData.pop();
      this.lineChartData[0] = actualCountry;

      for ( let i = 0; i < 4; i++ ) {
        this.lineChartLabels.pop();
      }
    }

    if ( this.lineChartData.length > 1 ) {
      this.lineChartData.pop();
    }

    this.csService.loadingOneCountry( country )
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

        this.lineChartData.push(newData);

        const color = [{ // blue
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          borderColor: '#007bff',
          pointBackgroundColor: 'black',
          pointBorderColor: 'black',
        },
        { // blue
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

//   <div class="alert alert-success" role="alert">
//   This is a success alert—check it out!
// </div>

}
