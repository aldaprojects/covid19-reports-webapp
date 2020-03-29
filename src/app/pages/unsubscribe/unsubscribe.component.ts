import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CovidService } from '../../services/covid.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {

  token: string;
  correct = false;

  constructor(public router: Router,
              public csService: CovidService) { }

  ngOnInit() {
    this.token = this.router.url.split('/')[2];
    this.csService.unsubscribe( this.token )
    .subscribe( (data: any) => {
      this.correct = data.ok;
    });
  }

}
