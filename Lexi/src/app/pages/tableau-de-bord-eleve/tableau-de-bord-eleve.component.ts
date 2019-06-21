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
        
        


        this.elevesList.push(new Eleve(1, "asd", "arghry", 0, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1aSBpq2L6B0P-oKEYFxqF7XvLWVxy2HMYwgxI82A0VQYsiTvB"));
        this.elevesList.push(new Eleve(2, "sdfga", "aerghrht", 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmxFiLRiD38eqgv3b72f0ZSCRVU8sLZ8BJdgLPGF7ARcptbBVI"));
        this.elevesList.push(new Eleve(3, "t4qt4e", "eratghys", 0, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFkS-2H6DXvajDpXgKXahuEsel17VoH8-CY38_3NqurBV3T8yQcg"));
        this.elevesList.push(new Eleve(4, "a4e3t5yrt6u", "earty", 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcVgREP74Z_WMOP-WhwvyVmz768vqudI8q9PNhEGvPqejPlI38Ig"));




        /*
        this.getAllEleve = this.apiService.GetEleveList().subscribe((data: any) => {
                if (data != null)
                    data.forEach(function (value) {
                        console.log(value);


                        this.elevesList.push(value as Eleve);
                    }.bind(this));
            this.ref.detectChanges();
        });


        */
        }
    


   


    selectUser(idEleve : number) {


        console.log("id selectionné " + idEleve);


    }









    }












