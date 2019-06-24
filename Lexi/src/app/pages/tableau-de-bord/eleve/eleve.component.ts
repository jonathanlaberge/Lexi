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
    @ViewChild(ClrForm, { static: true }) editForm;
    selectedEleve: Eleve = null;


    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private router: Router
    
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
                email: ['', [Validators.required, Validators.email]],
                dateNaissance: ['', []], 
                motdepasse: ['', [Validators.required, Validators.minLength(8)]]
            });


        this.elevesList.push(new Eleve(1, "asd", "arghry", 0, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1aSBpq2L6B0P-oKEYFxqF7XvLWVxy2HMYwgxI82A0VQYsiTvB"));
        this.elevesList.push(new Eleve(2, "sdfga", "aerghrht", 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmxFiLRiD38eqgv3b72f0ZSCRVU8sLZ8BJdgLPGF7ARcptbBVI"));
        this.elevesList.push(new Eleve(3, "t4qt4e", "eratghys", 0, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFkS-2H6DXvajDpXgKXahuEsel17VoH8-CY38_3NqurBV3T8yQcg"));
        this.elevesList.push(new Eleve(4, "a4e3t5yrt6u", "earty", 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcVgREP74Z_WMOP-WhwvyVmz768vqudI8q9PNhEGvPqejPlI38Ig"));


    }





    selectUser(idEleve: number) {
        console.log("id selectionné " + idEleve);
    }





    onEdit(user: Eleve) {




        this.selectedEleve = user;

        this.modifyForm.value.dateNaissance = user.dateNaissance;
        this.isEditModalOpen = true;




        console.log("id selectionné onEdit " + user.idEleve);
 
        }
    









    modifier() {









        if (this.modifyForm.invalid) {
            this.editForm.markAsTouched();
        }
        else {
            var eleve: Eleve = new Eleve();


            eleve.idEleve = this.modifyForm.value.idEleve;
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

