import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CovidService } from '../../services/covid.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public csService: CovidService) { }

  ngOnInit() {
  }

  soport( forma: NgForm ) {
    this.csService.soport( forma.value.email, forma.value.msg )
    .subscribe( (data) => {
      document.getElementById('soportForm').innerHTML =
      `
        <div class="text-center alert alert-success" role="alert">
          Mensaje enviado, gracias.
          <i class="fas fa-check"></i>
        </div>
      `;
    }
    );
  }

}
