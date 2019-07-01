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




    idEleve: number = 0;


   public isCreationModalOpen: boolean = true;
    public isLoadingModal: boolean = false;
     public errorServer: boolean = false;

    public  isReady: boolean = false;
    public isLoadingCategorie: boolean = false;

    public    selectedGlobalList: Fiche[] = [];
    public selectedFicheList: Fiche[] = [];
    public ficheList: Fiche[] = [];

    public  categorieList: Categorie[] = [];
    public  selectedCategorieRow: Categorie = null;

    public     isLoadingFiche: boolean = false;




    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute


    ) { }





    ngOnInit() {
        this.GetCategorieList(0);


        this.route.params.subscribe(params => {
            if (!isNaN(parseFloat(params['id']))) {


                this.idEleve = parseFloat(params['id']);

            }
            else
                this.router.navigate([`../`], { relativeTo: this.route });
        });



        /*
        this.apiService.GetPlayliste(this.idEleve).subscribe((data: any) => {
            if (data != null)
                data.forEach(function (value) {

                    console.log(value);

                    this.selectedGlobalList.push(value);
                    //this.selectedGlobalList.push(this.ficheList.find(x => x.idCategorie === value.idCategorie && x.idFiche === value.idFiche));
                }.bind(this));

            this.isLoadingFiche = false;
            this.ref.detectChanges();
        });
        */

    }






    Close() {
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




            //this.selectedFicheList.push(this.ficheList.find(x => x.idCategorie === selectedGlobalList.idCategorie && x.idFiche === value.idFiche));


            /*for (var item of this.selectedGlobalList) {
                 console.log(item);
                                  if (item.idCategorie == this.selectedCategorieRow.idCategorie)
                         this.selectedFicheList.push(item);
 
             }*/






            //  this.selectedGlobalList.push(this.ficheList.find(x => x.idCategorie === value.idCategorie && x.idFiche === value.idFiche));



            this.apiService.GetPlayliste(this.idEleve).subscribe((data: any) => {
                if (data != null)
                    data.forEach(function (value) {

                        console.log(value);

                        this.selectedFicheList.push(this.ficheList.find(x => x.idCategorie == value.idCategorie && x.idFiche == value.idFiche));
                        this.selectedGlobalList.push(this.ficheList.find(x => x.idCategorie === value.idCategorie && x.idFiche === value.idFiche));
                    }.bind(this));

                this.isLoadingFiche = false;
                this.ref.detectChanges();
            });
            /* this.selectedGlobalList.forEach(
                 x => {
                     if (x.idCategorie == this.selectedCategorieRow.idCategorie) {
                         this.selectedFicheList.push(this.ficheList.find(x => x.idCategorie === this.selectedCategorieRow.idCategorie));
 
                         console.log(x);
 
                         this.isLoadingFiche = false;
                         this.ref.detectChanges();
                     }
 
                 });*/













        });





    }


    SetSelectedCategorieRow(item: Categorie) {



       // this.addToGlobalList();

        this.selectedCategorieRow = item;
        this.GetFicheList(0, item.idCategorie);
    }

    ajouterList() {
        this.addToGlobalList();
        var selectedFicheListDTO: any[] = [];



        for (var f of this.selectedGlobalList) {

            selectedFicheListDTO.push({
                idMaitresse: APIService.currentMaitresse,
                idEleve: this.idEleve,
                idCategorie: f.idCategorie,
                idFiche: f.idFiche
                
            });


        }

        this.apiService.AddPlayliste(selectedFicheListDTO, this.idEleve).subscribe(
            (data: any) => {
                if (data.code == 200) {
                    this.isLoadingModal = false;
                    this.Close();
                }
                else
                    this.errorServer = true;
            },
            () => {
                this.errorServer = true;
                this.isLoadingModal = false;
            });
    }




    addToGlobalList() {



        this.selectedFicheList.forEach(
            x => {
            this.selectedGlobalList.push(x);
        })

        




    }









}
