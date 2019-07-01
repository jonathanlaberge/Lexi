import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { Eleve } from 'src/app/model/eleve';
import { APIService } from 'src/app/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component(
    {
        selector: 'app-eleve-creation',
        templateUrl: './eleve-creation.component.html'
    })
export class EleveCreationComponent implements OnInit
{
    @ViewChild(ClrForm, { static: true }) creationFormValidator;

    isCreationModalOpen: boolean = true;
    isLoadingModal: boolean = false;
    
    creationForm: FormGroup;
    
    errorServer: boolean = false;
    
    constructor(
        private apiService: APIService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit()
    {
        this.creationForm = this.formBuilder.group(
            {
                prenom: ['', [Validators.required]],
                nom: ['', [Validators.required]],
                genre: ['', []],
                dateNaissance: ['', []],
                avatar: ['', []]
            });
    }
    
    SubmitCreationForm()
    {
        if (this.creationForm.invalid)
        {
            this.creationFormValidator.markAsTouched();
        }
        else
        {
            this.isLoadingModal = true;
            var eleve: Eleve = new Eleve();
            
            eleve.prenom = this.creationForm.value.prenom;
            eleve.nom = this.creationForm.value.nom;
            eleve.dateNaissance = this.creationForm.value.dateNaissance;
            eleve.genre = this.creationForm.value.genre;
            eleve.avatar = this.creationForm.value.avatar;
            
            this.apiService.AddEleve(eleve).subscribe(
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

    Close()
    {
        this.errorServer = false;
        this.isLoadingModal = false;
        this.creationForm.reset();
        this.router.navigate([`../`], { relativeTo: this.route });
    }
}
