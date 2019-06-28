import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { Eleve } from 'src/app/model/eleve';
import { FicheDTO } from 'src/app/model/dto/ficheDTO';
import { Categorie } from 'src/app/model/categorie';
import { Fiche } from 'src/app/model/fiche';

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
    isLoadingCategorie: boolean = false;


    selectedFiche: FicheDTO[] = [];
    ficheList: FicheDTO[] = [];

    categorieList: Categorie[] = [];
    selectedCategorieRow: Categorie = null;

    isLoadingFiche: boolean = false;
   



    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute,
        private activeRoute: ActivatedRoute

    ) { }





    ngOnInit()
    {
        this.GetCategorieList(0);


        this.apiService.GetFicheList(0).subscribe((data: any) => {
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




    GetCategorieList(page: number) {
        this.isLoadingCategorie = true;
        this.categorieList = [];

        this.apiService.GetCategorieList(page).subscribe((data: any) => {
            if (data != null)
                data.forEach(function (value) {
                    this.categorieList.push(value as Categorie);
                }.bind(this));

            this.isLoadingCategorie = false;
            this.ref.detectChanges();
        });
    }

    GetFicheList(page: number, idCategorie: number) {
        this.isLoadingFiche = true;
        this.ficheList = [];

        this.apiService.GetFicheListCategorie(page, idCategorie).subscribe((data: any) => {
            if (data != null)
                data.forEach(function (value) {
                    this.ficheList.push(value as Fiche);
                }.bind(this));

            this.isLoadingFiche = false;
            this.ref.detectChanges();
        });
    }

    Refresh() {
        this.GetCategorieList(0);
        if (this.selectedCategorieRow != null)
            this.GetFicheList(0, this.selectedCategorieRow.idCategorie);
    }

    SetSelectedCategorieRow(item: Categorie) {
        this.selectedCategorieRow = item;
        this.GetFicheList(0, item.idCategorie);
    }





}
