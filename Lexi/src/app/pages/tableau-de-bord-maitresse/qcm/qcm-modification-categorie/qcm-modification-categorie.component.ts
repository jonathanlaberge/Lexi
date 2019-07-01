import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Categorie } from 'src/app/model/categorie';

@Component(
    {
        selector: 'app-qcm-modification-categorie',
        templateUrl: './qcm-modification-categorie.component.html'
    })
export class QCMModificationCategorieComponent implements OnInit
{
    @ViewChild(ClrForm, { static: true }) editFormValidator;

    categorie: Categorie = null
    isEditModalOpen: boolean = true;
    isLoadingModal: boolean = false;
    isReady: boolean = false;

    editForm: FormGroup;

    errorServer: boolean = false;

    constructor(
        private apiService: APIService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit()
    {
        this.editForm = this.formBuilder.group(
            {
                nom: ['', [Validators.required]],
                matiere: ['', [Validators.required]],
                niveau: ['', [Validators.required]],
                estPublic: ['', [Validators.required]]
            });

        this.route.params.subscribe(params =>
        {
            if (!isNaN(parseFloat(params['id'])))
            {
                this.apiService.GetCategorie(params['id']).subscribe(
                    (data: any) =>
                    {
                        this.categorie = data as Categorie;
                        this.editForm.setValue(
                            {
                                nom: this.categorie.nom,
                                matiere: this.categorie.matiere,
                                niveau: this.categorie.niveau,
                                estPublic: this.categorie.estPublic
                            });

                        this.isReady = true;
                    },
                    () =>
                    {
                        this.isLoadingModal = false;
                        this.errorServer = true;
                    });
            }
            else
                this.router.navigate([`../`], { relativeTo: this.route });
        });
    }

    SubmitEditForm()
    {
        if (this.editForm.invalid)
        {
            this.editFormValidator.markAsTouched();
        }
        else
        {
            this.isLoadingModal = true;

            this.categorie.nom = this.editForm.value.nom;
            this.categorie.matiere = this.editForm.value.matiere;
            this.categorie.niveau = this.editForm.value.niveau;
            this.categorie.estPublic = this.editForm.value.estPublic;

            this.apiService.EditCategorie(this.categorie).subscribe(
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
        this.editForm.reset();
        this.router.navigate([`../../`], { relativeTo: this.route });
    }
}
