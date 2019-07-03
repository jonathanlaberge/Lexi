import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Categorie } from 'src/app/model/categorie';
import { APIService } from 'src/app/service/api.service';
import { Fiche } from 'src/app/model/fiche';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component(
    {
        selector: 'app-qcm',
        templateUrl: './qcm.component.html',
        styleUrls: ['./qcm.component.css']
    })
export class QCMComponent implements OnInit, OnDestroy
{
    idMaitresse: number = 0;
    selectedCategorie: Categorie = null;
    selectedCategorieRow: Categorie = null;
    selectedFiche: Fiche = null;

    ficheList: Fiche[] = [];
    categorieList: Categorie[] = [];

    isLoadingCategorie: boolean = false;
    isLoadingFiche: boolean = false;
    isLoadingModal: boolean = false;
    isParentPageHidden: boolean = false;

    isCategorieDeleteModalOpen: boolean = false;
    isFicheDeleteModalOpen: boolean = false;

    errorServer: boolean = false;

    getCategorieListAPIService: Subscription;

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private activeRoute: ActivatedRoute) { }

    ngOnInit()
    {
        this.idMaitresse = APIService.currentMaitresse.idMaitresse;

        this.GetCategorieList(0);

        this.activeRoute.url.subscribe(() =>
        {
            if (this.router.url !== '/tableaudebord/qcm')
            {
                this.isParentPageHidden = true;
            }
            this.ref.detectChanges();
        });
    }

    ngOnDestroy()
    {
        if (this.getCategorieListAPIService != null)
            this.getCategorieListAPIService.unsubscribe();
    }

    GetCategorieList(page: number)
    {
        this.isLoadingCategorie = true;
        this.categorieList = [];
        
        this.getCategorieListAPIService = this.apiService.AdminController_CategorieGetList(page).subscribe((data: any) =>
        {
            this.categorieList = [];
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

        this.apiService.AdminController_FicheGetListCategorie(page, idCategorie).subscribe((data: any) =>
        {
            this.ficheList = [];
            if (data != null)
                data.forEach(function (value)
                {
                    this.ficheList.push(value as Fiche);
                }.bind(this));

            this.isLoadingFiche = false;
            this.ref.detectChanges();
        });
    }

    Refresh()
    {
        this.GetCategorieList(0);
        if (this.selectedCategorieRow != null)
            this.SetSelectedCategorieRow(this.selectedCategorieRow);
    }

    SetSelectedCategorieRow(item: Categorie)
    {
        if (this.selectedCategorieRow != item || this.isParentPageHidden /* Refresh la table fiche lors de création ou mofidication de fiche.*/)
        {
            this.selectedCategorieRow = item;
            this.GetFicheList(0, item.idCategorie);
        }
    }

    OnEditCategorie(categorie: Categorie)
    {
        this.router.navigate(['modificationcategorie', categorie.idCategorie], { relativeTo: this.activeRoute });
    }

    OnDeleteCategorie(categorie: Categorie)
    {
        this.selectedCategorie = categorie;
        this.isCategorieDeleteModalOpen = true;
    }

    DeleteCategorie()
    {
        this.isLoadingModal = true;
        this.errorServer = false;

        this.apiService.AdminController_CategorieDelete(this.selectedCategorie.idCategorie).subscribe(
            (data: any) =>
            {
                this.isLoadingModal = false;
                if (data.code == 200)
                {
                    this.isCategorieDeleteModalOpen = false;

                    if (this.selectedCategorie == this.selectedCategorieRow)
                        this.selectedCategorieRow = null;

                    this.GetCategorieList(0);
                }
                else
                    this.errorServer = true;
            },
            () =>
            {
                this.isLoadingModal = false;
                this.errorServer = true;
            });
    }

    OnEditFiche(fiche: Fiche)
    {
        this.isParentPageHidden = true;
        this.router.navigate(['modificationfiche', fiche.idCategorie, fiche.idFiche], { relativeTo: this.activeRoute });
    }

    OnCreateFiche()
    {
        this.isParentPageHidden = true;
        this.router.navigate(['creationfiche', this.selectedCategorieRow.idCategorie], { relativeTo: this.activeRoute });
    }

    OnDeleteFiche(fiche: Fiche)
    {
        this.selectedFiche = fiche;
        this.isFicheDeleteModalOpen = true;
    }

    DeleteFiche()
    {
        this.isLoadingModal = true;
        this.errorServer = false;

        this.apiService.AdminController_FicheDelete(this.selectedFiche.idCategorie, this.selectedFiche.idFiche).subscribe(
            (data: any) =>
            {
                if (data.code == 200)
                {
                    this.isLoadingModal = false;
                    this.isFicheDeleteModalOpen = false;
                    this.GetFicheList(0, this.selectedCategorieRow.idCategorie);
                }
                else
                    this.errorServer = true;
            },
            () =>
            {
                this.isLoadingModal = false;
                this.errorServer = true;
            });
    }
}
