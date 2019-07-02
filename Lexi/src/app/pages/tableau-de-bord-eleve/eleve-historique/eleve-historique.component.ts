import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HistoriqueDTO } from 'src/app/model/dto/historiqueDTO';
import { APIService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { RoutingService } from 'src/app/service/routing.service';

@Component({
  selector: 'app-eleve-historique',
  templateUrl: './eleve-historique.component.html',
  styleUrls: ['./eleve-historique.component.css']
})
export class EleveHistoriqueComponent implements OnInit {
    historiqueList: HistoriqueDTO[] = [];

    isLoading: boolean = false;

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router) { }

    ngOnInit() {
        RoutingService.adminMode = false;
        RoutingService.eleveConnected = true;
        RoutingService.SetRouteToEleve();

        if (!APIService.IsTokenInEleveMode())
            this.router.navigate(['/eleve']);

        this.isLoading = true;
        this.apiService.GetHistorique(0).subscribe((data: any) => {
            if (data != null)
                data.forEach(function (value) {
                    this.historiqueList.push(value as HistoriqueDTO);
                }.bind(this));

            this.isLoading = false;
            this.ref.detectChanges();
        });
    }

    SetSelectedFiche(fiche: HistoriqueDTO) {
        //this.router.navigate(['/eleve/qcm', fiche.idCategorie, fiche.idFiche]);
    }
}
