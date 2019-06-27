import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RoutingService } from 'src/app/service/routing.service';
import { Fiche } from 'src/app/model/fiche';
import { FicheDTO } from 'src/app/model/dto/ficheDTO';

@Component(
    {
        selector: 'app-eleve-fiche',
        templateUrl: './eleve-fiche.component.html',
        styleUrls: ['./eleve-fiche.component.css']
    })
export class EleveFicheComponent implements OnInit
{

    selectedFiche: FicheDTO = new FicheDTO();
    ficheList: FicheDTO[] = [];
    isReady: boolean = false;






    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private activeRoute: ActivatedRoute

    ) { }






    ngOnInit()
    {
        RoutingService.adminMode = false;
        RoutingService.eleveConnected = true;
        RoutingService.SetRouteToEleve();

        if (!APIService.IsTokenInEleveMode())
            this.router.navigate(['/eleve']);



        this.apiService.GetPlaylist(0).subscribe((data: any) => {
            if (data != null)
                data.forEach(function (value) {
                    this.ficheList.push(value as FicheDTO);
                }.bind(this));

            this.isReady = true;
            this.ref.detectChanges();
        });





    }

    setSelectedFiche(fiche: FicheDTO) {

        this.selectedFiche = fiche;
        console.log("selected idCategorie " + this.selectedFiche.idCategorie + "\n    selected idfiche " + this.selectedFiche.idFiche);


        this.router.navigate(['/eleve/qcm', this.selectedFiche.idCategorie, this.selectedFiche.idFiche]);


    }
}
