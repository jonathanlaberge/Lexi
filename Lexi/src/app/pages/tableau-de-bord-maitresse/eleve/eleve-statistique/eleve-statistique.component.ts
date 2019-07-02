import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { RoutingService } from 'src/app/service/routing.service';
import { HistoriqueDTO } from 'src/app/model/dto/historiqueDTO';

@Component({
  selector: 'app-eleve-statistique',
  templateUrl: './eleve-statistique.component.html',
  styleUrls: ['./eleve-statistique.component.css']
})
export class EleveStatistiqueComponent implements OnInit 

{

    constructor() { }

    ngOnInit() { }



}
