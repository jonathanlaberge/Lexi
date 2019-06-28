import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Fiche } from 'src/app/model/fiche';

@Component(
    {
        selector: 'app-qcmcreation-fiche',
        templateUrl: './qcmcreation-fiche.component.html',
        styleUrls: ['./qcmcreation-fiche.component.css']
    })
export class QCMCreationFicheComponent implements OnInit
{
    isCreationModalOpen: boolean = true;
    isLoadingModal: boolean = false;

    

    errorServer: boolean = false;
    
    constructor(
        private apiService: APIService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit()
    {

    }


    SubmitCreationForm()
    {
        if (/*this.creationForm.invalid*/false)
        {
            //this.creationFormValidator.markAsTouched();
        }
        else
        {
            this.isLoadingModal = true;
            var fiche: Fiche = new Fiche();

            //categorie.nom = this.creationForm.value.nom;
            //categorie.matiere = this.creationForm.value.matiere;
            //categorie.niveau = this.creationForm.value.niveau;
            //categorie.estPublic = this.creationForm.value.estPublic;

            //this.apiService.AddFiche(fiche).subscribe(
            //    (data: any) =>
            //    {
            //        if (data.code == 200)
            //        {
            //            this.isLoadingModal = false;
            //            this.Close();
            //        }
            //        else
            //            this.errorServer = true;
            //    },
            //    () =>
            //    {
            //        this.errorServer = true;
            //        this.isLoadingModal = false;
            //    });
        }
    }

    Close()
    {
        this.errorServer = false;
        this.isLoadingModal = false;
        this.router.navigate([`../`], { relativeTo: this.route });
    }
}
