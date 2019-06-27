import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Categorie } from 'src/app/model/categorie';
import { APIService } from 'src/app/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClrForm } from '@clr/angular';
import { Fiche } from 'src/app/model/fiche';

@Component({
    selector: 'app-qcm',
    templateUrl: './qcm.component.html',
    styleUrls: ['./qcm.component.css']
})
export class QCMComponent implements OnInit {
    @ViewChild(ClrForm, { static: true }) categorieFormValidator;


    selectedCategorie: Categorie = null;
    selectedFiche: Fiche = null;

    fichesList: Fiche[] = [];
    categoryList: Categorie[] = [];
    selectedCategorieRow: Categorie = null;

    isReady: boolean = false;
    isEditModalOpen: boolean = false;
    isDeleteModalOpen: boolean = false;



    isFicheEditModalOpen: boolean = false;
    isFicheDeleteModalOpen: boolean = false;



    modifyFicheForm: FormGroup;
    modifyCategorieForm: FormGroup;


    successEdit: boolean = false;
    successDelete: boolean = false;
    errorRegisterServer: boolean = false;



    


    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute
    ) { }

    // liste des qcm du prof dispinibe
    

    ngOnInit() {

        this.apiService.GetCategorieList(0).subscribe((data: any) => {
            if (data != null)
                data.forEach(function (value) {
                    console.log("GetCategorieList ", value as Categorie);
                    this.categoryList.push(value as Categorie);
                }.bind(this));

            this.isReady = true;
            this.ref.detectChanges();
        });

        


        this.modifyCategorieForm = this.formBuilder.group(
            {
                nom: ['', [Validators.required]],
                matiere: ['', []],
                niveau: ['', []],
                estPublic: ['', []]

            });

    }



    setSelectedselectedCategorieRow(item: Categorie) {

        this.selectedCategorieRow = item;
        console.log(item.idCategorie);


        this.apiService.GetFicheList(1,item.idCategorie).subscribe((data: any) => {
            if (data != null)
                data.forEach(function (value) {
         
                    this.fichesList.push(value as Categorie);
                }.bind(this));

            this.isReady = true;
            this.ref.detectChanges();
        });
    }



    onEdit(categorie: Categorie) {
        console.log("GetCategorieList ", categorie.idCategorie);
        this.selectedCategorie = categorie;
        this.isEditModalOpen = true;
    }



    editCategorie() {


        if (this.modifyCategorieForm.invalid) {
            this.categorieFormValidator.markAsTouched();
        }
        else {
            var categorie: Categorie = new Categorie();

            categorie.idCategorie = this.selectedCategorie.idCategorie
            categorie.nom = this.modifyCategorieForm.value.nom;

            categorie.matiere = this.modifyCategorieForm.value.matiere;
            categorie.niveau = this.modifyCategorieForm.value.niveau;
            categorie.estPublic = this.modifyCategorieForm.value.estPublic;

            categorie.idMaitresseCreatrice = this.selectedCategorie.idMaitresseCreatrice;


            this.apiService.EditCategorie(categorie).subscribe(
                (data: any) => {
                    if (data.code == 200) {
                        this.successEdit = true;
                        this.isEditModalOpen = false;
                    }
                    else
                        this.errorRegisterServer = true;
                },
                error => {
                    if (error.status == 401)
                        this.errorRegisterServer = true;
                    else
                        this.errorRegisterServer = true;
                });


        }

    }






    onDelete(categorie: Categorie) {

        console.log("delete  ", categorie.idCategorie);



        this.selectedCategorie = categorie;

        this.isDeleteModalOpen = true;

    }






    deleteCategorie() {

        this.apiService.DeleteCategorie(this.selectedCategorie.idCategorie).subscribe(
            (data: any) => {
                if (data.code == 200) {
                    this.successEdit = true;
                    this.isEditModalOpen = false;
                }
                else
                    this.errorRegisterServer = true;
            },
            error => {
                if (error.status == 401)
                    this.errorRegisterServer = true;
                else
                    this.errorRegisterServer = true;
            });
    }


















}
