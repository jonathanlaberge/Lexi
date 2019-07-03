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
        this.apiService.UserController_Historique(0).subscribe((data) => {
            if (data != null)
                
                    this.historiqueList= (data as HistoriqueDTO[]);
              
            console.log(data)
            this.isLoading = false;
            this.ref.detectChanges();
        });
    }

    SetSelectedFiche(fiche: HistoriqueDTO) {
        //this.router.navigate(['/eleve/qcm', fiche.idCategorie, fiche.idFiche]);
    }
}
