import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RoutingService } from 'src/app/service/routing.service';
import { APIService } from 'src/app/service/api.service';
import { Eleve } from 'src/app/model/eleve';




@Component(
    {
        selector: 'app-tableau-de-bord-eleve',
        templateUrl: './tableau-de-bord-eleve.component.html',
        styleUrls: ['./tableau-de-bord-eleve.component.css']
    })
export class TableauDeBordEleveComponent implements OnInit
{
    getAllEleve: any;
    constructor(private apiService: APIService, private ref: ChangeDetectorRef) { }
    elevesList: Eleve[] = [];
    ngOnInit()
    {
        RoutingService.adminMode = false;
        RoutingService.SetRouteToEleve();



        ///admin/user / liste / admin / user / liste
        


        this.getAllEleve = this.apiService.GetEleveList().subscribe((data: any) => {
                if (data != null)
                    data.forEach(function (value) {
                        console.log(value);


                        this.elevesList.push(value as Eleve);
                    }.bind(this));
            this.ref.detectChanges();
        });



        }
    


   












    }












