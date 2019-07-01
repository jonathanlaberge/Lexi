import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Categorie } from 'src/app/model/categorie';
import { APIService } from 'src/app/service/api.service';
import { Fiche } from 'src/app/model/fiche';
import { Router, ActivatedRoute } from '@angular/router';

@Component(
    {
        selector: 'app-qcm',
        templateUrl: './qcm.component.html',
        styleUrls: ['./qcm.component.css']
    })
export class QCMComponent implements OnInit
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

    isCategorieDeleteModalOpen: boolean = false;
    isFicheDeleteModalOpen: boolean = false;

    errorServer: boolean = false;

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit()
    {
        this.idMaitresse = APIService.currentMaitresse.idMaitresse;

        this.GetCategorieList(0);
    }

    GetCategorieList(page: number)
    {
        this.isLoadingCategorie = true;
        this.categorieList = [];

        this.apiService.GetCategorieList(page).subscribe((data: any) =>
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

        this.apiService.GetFicheListCategorie(page, idCategorie).subscribe((data: any) =>
        {
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
        if (this.selectedCategorieRow != item)
        {
            this.selectedCategorieRow = item;
            this.GetFicheList(0, item.idCategorie);
        }
    }

    OnEditCategorie(categorie: Categorie)
    {
        this.router.navigate(['modificationcategorie', categorie.idCategorie], { relativeTo: this.route });
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

        this.apiService.DeleteCategorie(this.selectedCategorie.idCategorie).subscribe(
            (data: any) =>
            {
                this.isLoadingModal = false;
                if (data.code == 200)
                {
                    this.isCategorieDeleteModalOpen = false;
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
        this.router.navigate(['modificationfiche', fiche.idCategorie, fiche.idFiche], { relativeTo: this.route });
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

        this.apiService.DeleteCategorie(this.selectedCategorie.idCategorie).subscribe(
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
