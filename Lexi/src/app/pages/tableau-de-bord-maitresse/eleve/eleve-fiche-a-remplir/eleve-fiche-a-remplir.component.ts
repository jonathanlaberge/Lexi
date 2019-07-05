import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Categorie } from 'src/app/model/categorie';
import { Fiche } from 'src/app/model/fiche';
import { Subscription } from 'rxjs';

@Component(
    {
        selector: 'app-eleve-fiche-a-remplir',
        templateUrl: './eleve-fiche-a-remplir.component.html'
    })
export class EleveFicheARemplirComponent implements OnInit, OnDestroy
{
    idEleve: number = 0;

    public isCreationModalOpen: boolean = true;
    public isLoadingModal: boolean = false;
    public errorServer: boolean = false;

    public isReady: boolean = false;
    public isLoadingCategorie: boolean = false;

    public selectedGlobalList: any[] = [];
    public selectedFicheList: Fiche[] = [];
    public ficheList: Fiche[] = [];

    public categorieList: Categorie[] = [];
    public selectedCategorieRow: Categorie = null;

    public isLoadingFiche: boolean = false;

    subscriptionParams: Subscription;
    subscriptionAdminControllerUserGetTODOList: Subscription;
    subscriptionAdminControllerCategorieGetList: Subscription;
    subscriptionAdminControllerFicheGetListCategorie: Subscription;
    subscriptionAdminControllerUserSetTODOList: Subscription;

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private activeRoute: ActivatedRoute) { }


    ngOnInit()
    {


        this.GetCategorieList(0);

        this.subscriptionParams = this.activeRoute.params.subscribe(params =>
        {
            if (!isNaN(parseFloat(params['id'])))
            {
                this.idEleve = parseFloat(params['id']);

                this.subscriptionAdminControllerUserGetTODOList =
                    this.apiService.AdminController_UserGetTODOList(this.idEleve).subscribe((data: any) =>
                    {
                        if (data != null)
                            data.forEach(function (value)
                            {
                                this.selectedGlobalList.push(value);
                            }.bind(this));
                        this.ref.detectChanges();
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

        if (this.subscriptionAdminControllerUserGetTODOList != null)
            this.subscriptionAdminControllerUserGetTODOList.unsubscribe();

        if (this.subscriptionAdminControllerCategorieGetList != null)
            this.subscriptionAdminControllerCategorieGetList.unsubscribe();

        if (this.subscriptionAdminControllerFicheGetListCategorie != null)
            this.subscriptionAdminControllerFicheGetListCategorie.unsubscribe();

        if (this.subscriptionAdminControllerUserSetTODOList != null)
            this.subscriptionAdminControllerUserSetTODOList.unsubscribe();
    }

    Close()
    {
        this.errorServer = false;
        this.isLoadingModal = false;

        this.router.navigate([`../../`], { relativeTo: this.activeRoute });
    }

    GetCategorieList(page: number)
    {
        this.isLoadingCategorie = true;
        this.categorieList = [];

        this.subscriptionAdminControllerCategorieGetList =
            this.apiService.AdminController_CategorieGetList(page).subscribe((data: any) =>
            {
                if (data != null)
                    data.forEach(function (value)
                    {
                        this.categorieList.push(value as Categorie);
                    }.bind(this));

                this.isLoadingCategorie = false;
                this.ref.detectChanges();
            });
    }

    GetFicheList(page: number, idCategorie: number)
    {
        this.isLoadingFiche = true;
        this.ficheList = [];

        this.subscriptionAdminControllerFicheGetListCategorie =
            this.apiService.AdminController_FicheGetListCategorie(page, idCategorie).subscribe((data: any) =>
            {
                if (data != null)
                    data.forEach(function (value)
                    {
                        this.ficheList.push(value as Fiche);
                    }.bind(this));

                this.SetSelectedFiche();
                this.isLoadingFiche = false;
                this.ref.detectChanges();
            });
    }


    SetSelectedCategorieRow(item: Categorie)
    {
        this.SetSelectedGlobalFiche();

        this.selectedCategorieRow = item;

        this.GetFicheList(0, item.idCategorie);
        this.SetSelectedFiche();
    }


    SetSelectedFiche()
    {
        this.selectedFicheList = [];

        this.ficheList.forEach(x =>
        {
            if (this.selectedGlobalList.some(y => y.idCategorie == x.idCategorie && y.idFiche == x.idFiche))
                this.selectedFicheList.push(x);
        });
    }

    //Appeler la methode AVANT un changement de sélection
    SetSelectedGlobalFiche()
    {
        if (this.selectedCategorieRow != null)
        {
            this.selectedGlobalList = this.selectedGlobalList.filter(x =>
                x.idCategorie != this.selectedCategorieRow.idCategorie);

            this.selectedFicheList.forEach(x =>
            {
                this.selectedGlobalList.push(
                    {
                        idMaitresse: APIService.currentMaitresse.idMaitresse,
                        idEleve: this.idEleve,
                        idCategorie: x.idCategorie,
                        idFiche: x.idFiche

                    });
            });
        }
    }

    SendList()
    {
        this.isLoadingModal = true;
        this.SetSelectedGlobalFiche();

        this.subscriptionAdminControllerUserSetTODOList =
            this.apiService.AdminController_UserSetTODOList(this.selectedGlobalList, this.idEleve).subscribe(
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
