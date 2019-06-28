import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { Eleve } from 'src/app/model/eleve';
import { FicheDTO } from 'src/app/model/dto/ficheDTO';

@Component({
  selector: 'app-eleve-fiche-aremplir',
  templateUrl: './eleve-fiche-aremplir.component.html',
  styleUrls: ['./eleve-fiche-aremplir.component.css']
})
export class EleveFicheARemplirComponent implements OnInit {



    isCreationModalOpen: boolean = true;
    isLoadingModal: boolean = false;

    errorServer: boolean = false;
    isReady: boolean = false;



    selectedFiche: FicheDTO[] = [];
    ficheList: FicheDTO[] = [];



    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute,
        private activeRoute: ActivatedRoute

    ) { }





    ngOnInit()
    {
        this.apiService.GetFicheList(0,4).subscribe((data: any) => {
            if (data != null)
                data.forEach(function (value) {
                    this.ficheList.push(value as FicheDTO);
                }.bind(this));

            this.isReady = true;
            this.ref.detectChanges();
        });

    }

    ajouterList()
    {




    }


    Close()
    {
        this.errorServer = false;
        this.isLoadingModal = false;

        this.router.navigate([`../../`], { relativeTo: this.route });
    }
}
