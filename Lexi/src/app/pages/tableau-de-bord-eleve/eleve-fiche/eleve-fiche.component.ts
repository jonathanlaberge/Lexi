import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from 'src/app/service/api.service';
import { Router, } from '@angular/router';
import { RoutingService } from 'src/app/service/routing.service';
import { FicheDTO } from 'src/app/model/dto/fiche-dto';

@Component(
    {
        selector: 'app-eleve-fiche',
        templateUrl: './eleve-fiche.component.html',
        styleUrls: ['./eleve-fiche.component.css']
    })
export class EleveFicheComponent implements OnInit
{
    ficheList: FicheDTO[] = [];

    isLoading: boolean = false;

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router) { }

    ngOnInit()
    {
        RoutingService.adminMode = false;
        RoutingService.eleveConnected = true;
        RoutingService.SetRouteToEleve();

        if (!APIService.IsTokenInEleveMode())
            this.router.navigate(['/eleve']);

        this.isLoading = true;
        this.apiService.UserController_FicheGetList(0).subscribe((data: any) =>
        {
            if (data != null)
                data.forEach(function (value)
                {
                    this.ficheList.push(value as FicheDTO);
                }.bind(this));

            this.isLoading = false;
            this.ref.detectChanges();
        });
    }

    SetSelectedFiche(fiche: FicheDTO)
    {
        this.router.navigate(['/eleve/qcm', fiche.idCategorie, fiche.idFiche]);
    }
}
