import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { CovidService } from '../../services/covid.service';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  rankingSubscription: Subscription;
  rankingwsSubscription: Subscription;

  @ViewChild(DataTableDirective, {static: true})

  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  countriesRanking: any[] = [];

  constructor(
    public wsService: WebsocketService,
    public csService: CovidService,
    public router: Router
  ) { }

  ngOnInit() {
    this.dtOptions = {
      searching: true,
      paging: false,
      ordering: true,
      info: false,
      language: {
          searchPlaceholder: 'Buscar país',
          search: '',
          zeroRecords : 'No se encontró un país con ese nombre'
      }
    };

    this.rankingSubscription = this.csService.loadingRanking()
    .subscribe(
      (data: any) => {
        if ( data.ok ) {
          this.countriesRanking = data.countries;
          environment.countries = data.countries;
          this.dtTrigger.next();
        }
      }
    );

    this.rankingwsSubscription = this.wsService.listen('newCases')
    .subscribe(
      (data: any) => {
        this.countriesRanking = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    );
  }

  ngOnDestroy() {
    this.rankingSubscription.unsubscribe();
    this.dtTrigger.unsubscribe();
    this.rankingwsSubscription.unsubscribe();
  }


  getCountry( pais: string ) {
    this.router.navigateByUrl('', { skipLocationChange: false }).then(() => {
      this.router.navigate([`/country/${pais}`]);
    });
  }

}
