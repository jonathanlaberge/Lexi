import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HistoriqueDTO } from 'src/app/model/dto/historique-dto';
import { APIService } from 'src/app/service/api.service';

@Component(
    {
        selector: 'app-eleve-historique',
        templateUrl: './eleve-historique.component.html',
        styleUrls: ['./eleve-historique.component.css']
    })
export class EleveHistoriqueComponent implements OnInit
{
    historiqueList: HistoriqueDTO[] = [];

    isLoading: boolean = false;

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef) { }

    ngOnInit()
    {
        this.isLoading = true;
        this.apiService.UserController_Historique(0).subscribe((data) =>
        {
            if (data != null)
                this.historiqueList = (data as HistoriqueDTO[]);
            
            this.isLoading = false;
            this.ref.detectChanges();
        });
    }
}
