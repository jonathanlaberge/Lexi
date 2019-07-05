import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HistoriqueDTO } from 'src/app/model/dto/historique-dto';
import { APIService } from 'src/app/service/api.service';
import { Subscription } from 'rxjs';

@Component(
    {
        selector: 'app-eleve-historique',
        templateUrl: './eleve-historique.component.html',
        styleUrls: ['./eleve-historique.component.css']
    })
export class EleveHistoriqueComponent implements OnInit, OnDestroy
{
    historiqueList: HistoriqueDTO[] = [];

    isLoading: boolean = false;

    subscriptionUserControllerHistorique: Subscription;

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef) { }

    ngOnInit()
    {
        this.isLoading = true;
        this.subscriptionUserControllerHistorique =
            this.apiService.UserController_Historique(0).subscribe(
                (data) =>
                {
                    if (data != null)
                        this.historiqueList = (data as HistoriqueDTO[]);

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
        if (this.subscriptionUserControllerHistorique != null)
            this.subscriptionUserControllerHistorique.unsubscribe();
    }
}
