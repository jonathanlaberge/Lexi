import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from 'src/app/model/categorie';

@Component(
    {
        selector: 'app-qcm-creation-categorie',
        templateUrl: './qcm-creation-categorie.component.html'
    })
export class QCMCreationCategorieComponent implements OnInit
{
    @ViewChild(ClrForm, { static: true }) creationFormValidator;

    isCreationModalOpen: boolean = true;
    isLoadingModal: boolean = false;

    creationForm: FormGroup;

    errorServer: boolean = false;

    constructor(
        private apiService: APIService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit()
    {
        this.creationForm = this.formBuilder.group(
            {
                nom: ['', [Validators.required]],
                matiere: ['', [Validators.required]],
                niveau: ['', [Validators.required]],
                estPublic: ['', [Validators.required]]
            });
    }

    SubmitCreationForm()
    {
        if (this.creationForm.invalid)
        {
            this.creationFormValidator.markAsTouched();
        }
        else
        {
            this.isLoadingModal = true;
            var categorie: Categorie = new Categorie();

            categorie.nom = this.creationForm.value.nom;
            categorie.matiere = this.creationForm.value.matiere;
            categorie.niveau = this.creationForm.value.niveau;
            categorie.estPublic = this.creationForm.value.estPublic;

            this.apiService.AddCategorie(categorie).subscribe(
                (data: any) =>
                {
                    if (data.code == 200)
                    {
                        this.isLoadingModal = false;
                        this.Close();
                    }
                    else
                        this.errorServer = true;
                },
                () =>
                {
                    this.errorServer = true;
                    this.isLoadingModal = false;
                });
        }
    }

    Close()
    {
        this.errorServer = false;
        this.isLoadingModal = false;
        this.creationForm.reset();
        this.router.navigate([`../`], { relativeTo: this.route });
    }
}
