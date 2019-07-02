import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { Eleve } from 'src/app/model/eleve';
import { FicheDTO } from 'src/app/model/dto/ficheDTO';
import { Categorie } from 'src/app/model/categorie';
import { Fiche } from 'src/app/model/fiche';
import { ficheGlobale } from 'src/app/model/dto/ficheGlobale';
import { isNullOrUndefined } from 'util';

@Component(
    {
        selector: 'app-eleve-fiche-a-remplir',
        templateUrl: './eleve-fiche-a-remplir.component.html'
    })
export class EleveFicheARemplirComponent implements OnInit
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

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute) { }


    ngOnInit()
    {


        this.GetCategorieList(0);

        this.route.params.subscribe(params =>
        {
            if (!isNaN(parseFloat(params['id'])))
            {
                this.idEleve = parseFloat(params['id']);

                this.apiService.GetPlayliste(this.idEleve).subscribe((data: any) =>
                {
                    console.log(data);
                    if (data != null)
                        data.forEach(function (value)
                        {
                            this.selectedGlobalList.push(value);
                        }.bind(this));
                    this.ref.detectChanges();
                });
            }
            else
                this.router.navigate([`../`], { relativeTo: this.route });
        });
    }

    Close()
    {
        this.errorServer = false;
        this.isLoadingModal = false;

        this.router.navigate([`../../`], { relativeTo: this.route });
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

        this.apiService.AddPlayliste(this.selectedGlobalList, this.idEleve).subscribe(
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
