import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { Eleve } from 'src/app/model/eleve';
import { APIService } from 'src/app/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eleve-creation',
  templateUrl: './eleve-creation.component.html',
  styleUrls: ['./eleve-creation.component.css']
})
export class EleveCreationComponent implements OnInit {
    @ViewChild(ClrForm, { static: true }) editForm;


    isAddModalOpen: boolean = true;


    
  


    addForm: FormGroup;


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


        this.addForm = this.formBuilder.group(
            {
                prenom: ['', [Validators.required]],
                nom: ['', ],
                genre: ['', ],
                email: ['', ],
                dateNaissance: ['',[]],
                avatar: ['', []]
            });
  }










    submitAddForm() {









        if (this.addForm.invalid) {
            this.editForm.markAsTouched();
        }
        else {
            var eleve: Eleve = new Eleve();


            //eleve.idEleve = this.addForm.value.idEleve;
            eleve.prenom = this.addForm.value.prenom;
            eleve.nom = this.addForm.value.nom;
            eleve.dateNaissance = this.addForm.value.dateNaissance;
            eleve.genre = this.addForm.value.genre;
            eleve.avatar = this.addForm.value.avatar;


            this.apiService.AddEleve(eleve).subscribe(
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
        this.addForm.reset();
        this.router.navigate([`../`], { relativeTo: this.route });
    }


    











}
