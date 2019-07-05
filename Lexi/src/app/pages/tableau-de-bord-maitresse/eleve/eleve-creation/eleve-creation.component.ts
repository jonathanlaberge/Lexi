import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { Eleve } from 'src/app/model/eleve';
import { APIService } from 'src/app/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component(
    {
        selector: 'app-eleve-creation',
        templateUrl: './eleve-creation.component.html'
    })
export class EleveCreationComponent implements OnInit, OnDestroy
{
    @ViewChild(ClrForm, { static: true }) creationFormValidator;

    isCreationModalOpen: boolean = true;
    isLoadingModal: boolean = false;

    creationForm: FormGroup;

    errorServer: boolean = false;

    avatars: any[];
    selectedAvatarPath: string;

    subscriptionAdminControllerUserCreation: Subscription;

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
                limitNumberOfQuestions: ['', []],
                isShowingErrorWhenValidating: ['', []]
            });

        this.creationForm.patchValue(
            {
                limitNumberOfQuestions: "0",
                isShowingErrorWhenValidating: true
            });

        this.SetupAvatarList();
    }

    ngOnDestroy()
    {
        if (this.subscriptionAdminControllerUserCreation != null)
            this.subscriptionAdminControllerUserCreation.unsubscribe();
    }

    SetupAvatarList()
    {
        this.avatars = [];

        for (var i = 0; i <= 22; i++)
        {
            this.avatars.push(
                {
                    source: 'assets/kids-avatars/png/boy-' + i + '.png',
                    alt: 'Avatar Gars ' + 1,
                    title: 'Gars ' + i
                });
        }

        for (var i = 0; i <= 26; i++)
        {
            this.avatars.push(
                {
                    source: 'assets/kids-avatars/png/girl-' + i + '.png',
                    alt: 'Avatar Fille ' + 1,
                    title: 'Fille ' + i
                });
        }
    }

    SetChosenAvatar(index: number)
    {
        this.selectedAvatarPath = this.avatars[index].source;
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

            if (this.creationForm.value.dateNaissance != "")
                eleve.dateNaissance = this.creationForm.value.dateNaissance;

            if (this.creationForm.value.genre != "")
                eleve.genre = this.creationForm.value.genre;

            if (this.selectedAvatarPath != "")
                eleve.avatar = this.selectedAvatarPath;


            if (this.creationForm.value.isShowingErrorWhenValidating == true)
                eleve.qcmMode = 1;

            switch (this.creationForm.value.limitNumberOfQuestions)
            {
                case "10":
                    eleve.qcmMode = + 128;
                    break;
                case "8":
                    eleve.qcmMode = + 256;
                    break;
                case "6":
                    eleve.qcmMode = + 512;
                    break;
            }

            this.subscriptionAdminControllerUserCreation =
                this.apiService.AdminController_UserCreation(eleve).subscribe(
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
