import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Eleve } from 'src/app/model/eleve';
import { APIService } from 'src/app/service/api.service';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component(
    {
        selector: 'app-eleve',
        templateUrl: './eleve.component.html',
        styleUrls: ['./eleve.component.css']
    })
export class EleveComponent implements OnInit
{
    @ViewChild(ClrForm, { static: true }) editFormValidator;

    elevesList: Eleve[] = [];
    selectedEleve: Eleve = null;

    isEditModalOpen: boolean = false;
    isDeleteModalOpen: boolean = false;

    editForm: FormGroup;
    
    errorServer: boolean = false;

    isLoadingModal: boolean = false;
    isLoading: boolean = false;
    
    avatars: any[];
    avatarPathIndex: number;
    selectedAvatarPath: string;

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit()
    {

        this.editForm = this.formBuilder.group(
            {
                prenom: [[Validators.required]],
                nom: [[Validators.required]],
                genre: [[Validators.required]],
                dateNaissance: ['', []]
            });

        this.GetEleveList(0);
    }

    GetEleveList(page: number)
    {
        this.elevesList = [];
        this.isLoading = true;
        this.apiService.GetEleveList(page).subscribe((data: any) =>
        {
            if (data != null)
                data.forEach(function (value)
                {
                    this.elevesList.push(value as Eleve);
                }.bind(this));

            this.isLoading = false;
            this.ref.detectChanges();
        });
    }


    OnEdit(eleve: Eleve)
    {
        this.selectedEleve = eleve;
        this.editForm.setValue(
            {
                prenom: eleve.prenom,
                nom: eleve.nom,
                genre: eleve.genre,
                dateNaissance: eleve.dateNaissance
            });
        
        this.SetupAvatarList({ source: this.selectedEleve.avatar, alt: 'Avatar actuel', title: 'Avatar actuel' });
        this.SetChosenAvatar(0);
        
        this.errorServer = false;
        this.isEditModalOpen = true;
    }


    SetChosenAvatar(index: number)
    {
        this.selectedAvatarPath = this.avatars[index].source;
    }

    SetupAvatarList(firstAvatar: any = null)
    {
        this.avatars = [];

        if (firstAvatar != null)
            this.avatars.push(firstAvatar);

        for (var i = 0; i <= 22; i++)
        {
            this.avatars.push({ source: 'assets/kids-avatars/png/boy-' + i + '.png', alt: 'Avatar Gars ' + 1, title: 'Gars ' + i });
        }

        for (var i = 0; i <= 26; i++)
        {
            this.avatars.push({ source: 'assets/kids-avatars/png/girl-' + i + '.png', alt: 'Avatar Gille ' + 1, title: 'Fille ' + i });
        }
    }

    SubmitEditEleve()
    {
        if (this.editForm.invalid)
        {
            this.editFormValidator.markAsTouched();
        }
        else
        {
            var eleve: Eleve = new Eleve();

            eleve.idEleve = this.selectedEleve.idEleve;
            eleve.prenom = this.editForm.value.prenom;
            eleve.nom = this.editForm.value.nom;
            eleve.dateNaissance = this.editForm.value.dateNaissance;
            eleve.genre = this.editForm.value.genre;

            if (this.selectedAvatarPath != "")
                eleve.avatar = this.selectedAvatarPath;

            this.isLoadingModal = true;
            this.errorServer = false;

            this.apiService.EditEleve(eleve).subscribe(
                (data: any) =>
                {
                    this.isLoadingModal = false;
                    if (data.code == 200)
                    {
                        this.GetEleveList(0);
                        this.isEditModalOpen = false;
                    }
                    else
                        this.errorServer = true;
                },
                () =>
                {
                    this.isLoadingModal = false;
                    this.errorServer = true;
                });
        }
    }

    OnDelete(eleve: Eleve)
    {
        this.selectedEleve = eleve;

        this.errorServer = false;
        this.isDeleteModalOpen = true;
    }

    SubmitDeleteEleve(idEleve: number)
    {
        this.isLoadingModal = true;
        this.errorServer = false;

        this.apiService.DeleteEleve(idEleve).subscribe(
            (data: any) =>
            {
                this.isLoadingModal = false;
                if (data.code == 200)
                {
                    this.GetEleveList(0);
                    this.isDeleteModalOpen = false;
                }
                else
                    this.errorServer = true;
            },
            () =>
            {
                this.isLoadingModal = false;
                this.errorServer = true;
            });
    }

    //ShowHistory(user: Eleve)
    //{
    //    console.log("id selectionné history " + user.idEleve);
    //}

    SelectPlayList(user: Eleve)
    {
        this.router.navigate(['fichearemplir', user.idEleve], { relativeTo: this.route });
    }
}
