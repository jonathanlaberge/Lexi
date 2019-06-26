import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from 'src/app/model/categorie';

@Component({
  selector: 'app-qcmcreation-categorie',
  templateUrl: './qcmcreation-categorie.component.html',
  styleUrls: ['./qcmcreation-categorie.component.css']
})
export class QCMCreationCategorieComponent implements OnInit {


    @ViewChild(ClrForm, { static: true }) addCategorieFormValidator;

    isAddModalOpen: boolean = true;






    addCategorieForm: FormGroup;


    successRegister: boolean = false;
    errorRegisterServer: boolean = false;

    successAdd: boolean = false;
    errorAddServer: boolean = false;



    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute

    ) { }

    ngOnInit() {


        this.addCategorieForm = this.formBuilder.group(
            {
                nom: ['', [Validators.required]],
                matiere: ['', [Validators.required]],
                niveau: ['',[]],
                estPublic: ['', [Validators.required]]

            });
    }

    

    submitAddCategorieForm() {


        if (this.addCategorieForm.invalid) {
            this.addCategorieFormValidator.markAsTouched();
        }
        else {
            var categorie: Categorie = new Categorie();



           // categorie.idCategorie = this.addCategorieForm.value.idCategorie;
            categorie.nom = this.addCategorieForm.value.nom;
            categorie.matiere = this.addCategorieForm.value.matiere;
            categorie.niveau = this.addCategorieForm.value.niveau;
            categorie.estPublic = this.addCategorieForm.value.estPublic;
            //categorie.idMaitresseCreatrice = this.addCategorieForm.value.idMaitresseCreatrice;

            this.apiService.AddCategorie(categorie).subscribe(
                (data: any) => {
                    if (data.code == 200) {
                        this.successRegister = true;
                        this.cancel();

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

    cancel() {
        this.addCategorieForm.reset();
        this.router.navigate([`../`], { relativeTo: this.route });
    }







}
