import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { APIService } from 'src/app/service/api.service';
import { Router, } from '@angular/router';
import { RoutingService } from 'src/app/service/routing.service';
import { FicheDTO } from 'src/app/model/dto/fiche-dto';
import { Subscription } from 'rxjs';

@Component(
    {
        selector: 'app-eleve-fiche',
        templateUrl: './eleve-fiche.component.html',
        styleUrls: ['./eleve-fiche.component.css']
    })
export class EleveFicheComponent implements OnInit, OnDestroy
{
    ficheList: FicheDTO[] = [];

    isLoading: boolean = false;

    subscriptionUserControllerFicheGetList: Subscription;

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
        this.subscriptionUserControllerFicheGetList =
            this.apiService.UserController_FicheGetList(0).subscribe(
                (data: any) =>
                {
                    if (data != null)
                        data.forEach(function (value)
                        {
                            this.ficheList.push(value as FicheDTO);
                        }.bind(this));

                    this.isLoading = false;
                    this.ref.detectChanges();
                },
                () =>
                {
                    this.isLoading = false;
                });
    }

    ngOnDestroy()
    {
        if (this.subscriptionUserControllerFicheGetList != null)
            this.subscriptionUserControllerFicheGetList.unsubscribe();
    }

    SetSelectedFiche(fiche: FicheDTO)
    {
        this.router.navigate(['/eleve/qcm', fiche.idCategorie, fiche.idFiche]);
    }
}
