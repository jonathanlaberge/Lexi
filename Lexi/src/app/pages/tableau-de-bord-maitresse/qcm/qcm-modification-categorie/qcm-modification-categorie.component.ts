import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Categorie } from 'src/app/model/categorie';
import { Subscription } from 'rxjs';

@Component(
    {
        selector: 'app-qcm-modification-categorie',
        templateUrl: './qcm-modification-categorie.component.html'
    })
export class QCMModificationCategorieComponent implements OnInit, OnDestroy
{
    @ViewChild(ClrForm, { static: true }) editFormValidator;

    categorie: Categorie = null
    isEditModalOpen: boolean = true;
    isLoadingModal: boolean = false;
    isReady: boolean = false;

    editForm: FormGroup;

    errorServer: boolean = false;

    subscriptionParams: Subscription;
    subscriptionAdminControllerCategorieGet: Subscription;
    subscriptionAdminControllerCategorieSet: Subscription;

    constructor(
        private apiService: APIService,
        private formBuilder: FormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute) { }

    ngOnInit()
    {
        this.editForm = this.formBuilder.group(
            {
                nom: ['', [Validators.required]],
                matiere: ['', [Validators.required]],
                niveau: ['', [Validators.required]],
                estPublic: ['', [Validators.required]]
            });

        this.subscriptionParams = this.activeRoute.params.subscribe(params =>
        {
            if (!isNaN(parseFloat(params['id'])))
            {
                this.subscriptionAdminControllerCategorieGet =
                    this.apiService.AdminController_CategorieGet(params['id']).subscribe(
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
                this.router.navigate([`../`], { relativeTo: this.activeRoute });
        });
    }

    ngOnDestroy()
    {
        if (this.subscriptionParams != null)
            this.subscriptionParams.unsubscribe();

        if (this.subscriptionAdminControllerCategorieGet != null)
            this.subscriptionAdminControllerCategorieGet.unsubscribe();

        if (this.subscriptionAdminControllerCategorieSet != null)
            this.subscriptionAdminControllerCategorieSet.unsubscribe();
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

            this.subscriptionAdminControllerCategorieSet =
                this.apiService.AdminController_CategorieSet(this.categorie).subscribe(
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
        this.router.navigate([`../../`], { relativeTo: this.activeRoute });
    }
}
