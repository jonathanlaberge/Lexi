import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Eleve } from 'src/app/model/eleve';
import { APIService } from 'src/app/service/api.service';
import { RoutingService } from 'src/app/service/routing.service';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-eleve',
    templateUrl: './eleve.component.html',
    styleUrls: ['./eleve.component.css']
})
export class EleveComponent implements OnInit {


    @ViewChild(ClrForm, { static: true }) editFormValidator;





    selectedEleve: Eleve = null;
    isReady: boolean = false;


    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute
    
    ) { }


    elevesList: Eleve[] = [];

    isEditModalOpen: boolean = false;


    modifyForm: FormGroup;

    
    successRegister: boolean = false;

    errorRegisterServer: boolean = false;
   



    ngOnInit() {


        this.modifyForm = this.formBuilder.group(
            {
                prenom: ['', [Validators.required]],
                nom: ['', [Validators.required]],
                genre: ['', [Validators.required]],
                dateNaissance: ['', []],
                avatar: ['', []]
               
            });



        RoutingService.adminMode = false;
        RoutingService.SetRouteToEleve();

        this.activeRoute.url.subscribe(() => {
            if (this.router.url === '/eleve') {
                RoutingService.eleveConnected = false;
            }
            RoutingService.EmitRouteSubject();
            this.ref.detectChanges();
        });

        this.apiService.GetEleveList().subscribe((data: any) => {
            if (data != null)
                data.forEach(function (value) {
                    this.elevesList.push(value as Eleve);
                }.bind(this));

            this.isReady = true;
            this.ref.detectChanges();
        });


    }





    selectUser(idEleve: number) {
        console.log("id selectionné " + idEleve);
    }





    onEdit(user: Eleve) {
        this.selectedEleve = user;
        this.isEditModalOpen = true;
        console.log("id selectionné onEdit " + user.idEleve);
 
        }
    



    
    editEleve() {


        if (this.modifyForm.invalid) {
            this.editFormValidator.markAsTouched();
        }
        else {
            var eleve: Eleve = new Eleve();


            eleve.idEleve = this.selectedEleve.idEleve;
            eleve.prenom = this.modifyForm.value.prenom;
            eleve.nom = this.modifyForm.value.nom;
            eleve.dateNaissance = this.modifyForm.value.dateNaissance;
            eleve.genre = this.modifyForm.value.genre;
            eleve.avatar = this.modifyForm.value.avatar;


            this.apiService.EditEleve(eleve).subscribe(
                (data: any) => {
                    if (data.code == 200) {
                        this.successRegister = true;
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



    



    onDelete(user: Eleve) {

        
        console.log("id selectionné delete " + user.idEleve);


    }
       onHistory(user: Eleve) {


        console.log("id selectionné history " + user.idEleve);


    }
       onPickPlayList(user: Eleve) {


        console.log("id selectionné playlist " + user.idEleve);


    }



}

