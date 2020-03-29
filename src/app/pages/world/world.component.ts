import { Component, OnInit } from '@angular/core';
import { CovidService } from '../../services/covid.service';
import { WebsocketService } from '../../services/websocket.service';
import { map, filter } from 'rxjs/operators';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements OnInit {


  totalCases: any = {
    total_cases: 0,
    total_recovered: 0,
    total_deaths: 0,
    recovered: 0.0,
    deaths: 0.0,
    other: 0.0
  };

  flag: object = {
    China: 'CN',
    Italy: 'IT',
    USA: 'US',
    Spain: 'ES',
    Germany: 'DE',
    Iran: 'IR',
    France: 'FR',
    Switzerland: 'CH',
    UK: 'GB',
    'S. Korea': 'KR',
    Netherlands: 'NL',
    Austria: 'AT',
    Belgium: 'BE',
    Canada: 'CA',
    Turkey: 'TR',
    Portugal: 'PT',
    Norway: 'NO',
    Sweden: 'SE',
    Australia: 'AU',
    Israel: 'IL',
    Brazil: 'BR',
    Malaysia: 'MY',
    Czechia : 'CZ',
    Denmark : 'DK',
    Ireland: 'IE',
    Luxembourg: 'LU',
    Japan: 'JP',
    Ecuador: 'EC',
    Chile : 'CL',
    Poland: 'PL',
    Pakistan : 'PK',
    Thailand: 'TH',
    Romania: 'RO',
    'Saudi Arabia': 'SA',
    Finland: 'FI',
    'South Africa': 'ZA',
    Indonesia: 'ID',
    Greece: 'GR',
    Russia: 'RU',
    Iceland: 'IS',
    India: 'IN',
    'Diamond Princess': 'XX',
    Philippines: 'PH',
    Singapore: 'SG',
    Peru: 'PE',
    Slovenia: 'SI',
    Panama: 'PA',
    Qatar : 'QA',
    Estonia: 'EE',
    Argentina: 'AR',
    Croatia: 'HR',
    Colombia: 'CO',
    'Dominican Republic': 'DO',
    Mexico: 'MX',
    Bahrain: 'BH',
    Serbia: 'RS',
    Egypt: 'EG',
    'Hong Kong': 'HK',
    Iraq: 'IQ',
    Lebanon: 'LB',
    Algeria: 'DZ',
    UAE: 'AE',
    Lithuania: 'LT',
    Armenia: 'AM',
    'New Zealand': 'NZ',
    Morocco: 'MA',
    Bulgaria: 'BG',
    Hungary: 'HU',
    Taiwan: 'TW',
    Latvia: 'LV',
    'Costa Rica': 'CR',
    Slovakia: 'SK',
    Andorra: 'AD',
    Uruguay: 'UY',
    Jordan: 'JO',
    'San Marino': 'SM',
    Kuwait: 'KW',
    'North Macedonia': 'MK',
    Tunisia: 'TN',
    'Bosnia and Herzegovina': 'BA',
    Moldova: 'MD',
    Albania: 'AL',
    Ukraine: 'UA',
    Vietnam: 'VN',
    'Burkina Faso': 'BF',
    Cyprus: 'CY',
    'Faeroe Islands': 'FO',
    Réunion: 'RE',
    Malta: 'MT',
    Ghana: 'GH',
    Azerbaijan: 'AZ',
    Brunei: 'BN',
    Kazakhstan: 'KZ',
    Oman: 'OM',
    'Sri Lanka': 'LK',
    Venezuela: 'VE',
    Senegal: 'SN',
    Cambodia: 'KH',
    Afghanistan: 'AF',
    Belarus: 'BY',
    Palestine: 'PS',
    Mauritius: 'MU',
    'Ivory Coast': 'CI',
    Georgia: 'GE',
    Cameroon: 'CM',
    Guadeloupe: 'GP',
    Montenegro: 'ME',
    Cuba: 'CU',
    Martinique: 'MQ',
    Uzbekistan: 'UZ',
    'Trinidad and Tobago': 'TT',
    Honduras: 'HN',
    DRC: 'CD',
    Nigeria: 'NG',
    Liechtenstein: 'LI',
    'Channel Islands': 'JE',
    Bangladesh: 'BD',
    Kyrgyzstan: 'KG',
    Paraguay: 'PY',
    Rwanda: 'RW',
    Bolivia: 'BO',
    Mayotte: 'YT',
    Kenya: 'KE',
    Macao: 'MO',
    Monaco: 'MC',
    'French Polynesia': 'PF',
    'French Guiana': 'GF',
    Jamaica: 'JM',
    Gibraltar: 'GI',
    'Isle of Man': 'IM',
    Guatemala: 'GT',
    Madagascar: 'MG',
    Togo: 'TG',
    Aruba: 'AW',
    Barbados: 'BB',
    Zambia: 'ZM',
    'New Caledonia': 'NC',
    Uganda: 'UG',
    'El Salvador': 'SV',
    Maldives: 'MV',
    Tanzania: 'TZ',
    Ethiopia: 'ET',
    Djibouti: 'DJ',
    Dominica: 'DM',
    Mongolia: 'MN',
    'Saint Martin': 'MF',
    'Equatorial Guinea': 'GQ',
    'Cayman Islands': 'KY',
    Haiti: 'HT',
    Namibia: 'NA',
    Suriname: 'SR',
    Gabon: 'GA',
    Niger: 'NE',
    Bermuda: 'BM',
    Mozambique: 'MZ',
    Seychelles: 'SC',
    Curaçao: 'CW',
    Benin: 'BJ',
    Greenland: 'GL',
    Laos: 'LA',
    Guyana: 'GY',
    Bahamas: 'BS',
    Fiji: 'FJ',
    Syria: 'SY',
    'Cabo Verde': 'CV',
    Congo: 'CG',
    Eritrea: 'ER',
    Guinea: 'GN',
    'Vatican City': 'VA',
    Mali: 'ML',
    Eswatini: 'SZ',
    Gambia: 'GM',
    Sudan: 'SD',
    Zimbabwe: 'ZW',
    Nepal: 'NP',
    Angola: 'AO',
    'Antigua and Barbuda': 'AG',
    CAR: 'CF',
    Chad: 'TD',
    Liberia: 'LR',
    Mauritania: 'MR',
    Myanmar: 'MM',
    'St. Barth': 'BL',
    'Saint Lucia': 'LC',
    'Sint Maarten': 'SX',
    Belize: 'BZ',
    Bhutan: 'BT',
    'British Virgin Islands': 'VG',
    'Guinea-Bissau': 'GW',
    Montserrat: 'MS',
    Nicaragua: 'NI',
    'Saint Kitts and Nevis': 'KN',
    Somalia: 'SO',
    'Turks and Caicos': 'TC',
    Grenada: 'GD',
    Libya: 'LY',
    'Papua New Guinea': 'PG',
    'St. Vincent Grenadines': 'VC',
    'Timor-Leste': 'TL'
  };

  latestCases: any[] = [];

  constructor(
    public csService: CovidService,
    public wsService: WebsocketService,
    public router: Router
  ) { }

  ngOnInit() {
    this.csService.loadingTotalCases()
    .subscribe( (data: any) => {
      if ( data.ok ) {
        this.totalCases = data.global;
        this.totalCases.recovered = (this.totalCases.total_recovered * 100 / this.totalCases.total_cases).toFixed(2);
        this.totalCases.deaths = (this.totalCases.total_deaths * 100 / this.totalCases.total_cases).toFixed(2);
      }
    });
    this.wsService.listen('globalCases')
    .subscribe( (data: any) => {
      this.totalCases = data;
      this.totalCases.recovered = (this.totalCases.total_recovered * 100 / this.totalCases.total_cases).toFixed(2);
      this.totalCases.deaths = (this.totalCases.total_deaths * 100 / this.totalCases.total_cases).toFixed(2);
    });

    this.csService.loadingLatestCases()
    .pipe( filter( (data: any) => {
        const cases = data.cases;
        // tslint:disable-next-line: prefer-for-of
        for ( let i = 0; i < cases.length; i++ ) {
          cases[i].date = new Date(cases[i].date).toLocaleString();
        }
        return true;
    }))
    .subscribe( (data: any) => {
      if ( data.ok ) {
        this.latestCases = data.cases;
      }
    });
    this.wsService.listen('latestCases')
    .pipe( filter( (data: any) => {
      const cases = data;
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < cases.length; i++ ) {
        cases[i].date = new Date(cases[i].date).toLocaleString();
      }
      return true;
  }))
    .subscribe( (data: any) => {
      this.latestCases = data;
    });
  }

  seeInfoCountry( country: string ) {
    this.router.navigate([`/country/${country}`]);
  }

}
