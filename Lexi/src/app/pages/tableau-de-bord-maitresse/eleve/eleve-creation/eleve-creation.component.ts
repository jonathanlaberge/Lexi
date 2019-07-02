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
export class EleveCreationComponent implements OnInit {
    @ViewChild(ClrForm, { static: true }) creationFormValidator;

    isCreationModalOpen: boolean = true;
    isLoadingModal: boolean = false;

    creationForm: FormGroup;

    errorServer: boolean = false;




    images: any[];
    selectedAvatarPath: string;

    constructor(
        private apiService: APIService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {


        this.images = [];

        for (var i = 1; i <= 22; i++) {
            this.images.push({ source: 'assets/kids-avatars/png/boy-' + i + '.png', alt: 'Avatar garcon ' + 1, title: 'Garcon ' + i });
        }

        for (var i = 1; i <= 26; i++) {
            this.images.push({ source: 'assets/kids-avatars/png/girl-' + i + '.png', alt: 'Avatar fille ' + 1, title: 'Fille ' + i });
        }





        this.creationForm = this.formBuilder.group(
            {
                prenom: ['', [Validators.required]],
                nom: ['', [Validators.required]],
                genre: ['', []],
                dateNaissance: ['', []],
                avatar: ['', []]
            });
    }

    getAvatar(index: number) {
        console.log(this.images[index].source)
        this.selectedAvatarPath = this.images[index].source;
    }


    SubmitCreationForm() {
        if (this.creationForm.invalid) {
            this.creationFormValidator.markAsTouched();
        }
        else {
            this.isLoadingModal = true;
            var eleve: Eleve = new Eleve();

            eleve.prenom = this.creationForm.value.prenom;
            eleve.nom = this.creationForm.value.nom;
            if (this.creationForm.value.dateNaissance != "")
                eleve.dateNaissance = this.creationForm.value.dateNaissance;
            if (this.creationForm.value.genre != "")
                eleve.genre = this.creationForm.value.genre;
            if (this.creationForm.value.selectedAvatarPath != "")
                eleve.avatar = this.selectedAvatarPath;

            console.log(eleve);

            this.apiService.AddEleve(eleve).subscribe(
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
    }



    Close() {
        this.errorServer = false;
        this.isLoadingModal = false;
        this.creationForm.reset();
        this.router.navigate([`../`], { relativeTo: this.route });
    }
}
