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
    
    successEdit: boolean = false;
    successDelete: boolean = false;

    errorRegisterServer: boolean = false;
    isReady: boolean = false;
    
    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder) { }
    
    ngOnInit()
    {
        this.editForm = this.formBuilder.group(
            {
                prenom: ['', [Validators.required]],
                nom: ['', [Validators.required]],
                genre: ['', [Validators.required]],
                dateNaissance: ['', []],
                avatar: ['', []]

            });

        this.GetEleveList();
    }

    GetEleveList()
    {
        this.isReady = false;
        this.apiService.GetEleveList().subscribe((data: any) =>
        {
            if (data != null)
                data.forEach(function (value)
                {
                    this.elevesList.push(value as Eleve);
                }.bind(this));

            this.isReady = true;
            this.ref.detectChanges();
            console.log(this.elevesList);
        });
    }

    OnEdit(eleve: Eleve)
    {
        this.selectedEleve = eleve;
        this.editForm.patchValue(
            {
                prenom: eleve.prenom,
                nom: eleve.nom,
                genre: eleve.genre,
                dateNaissance: eleve.dateNaissance.getDate(),
                avatar: eleve.avatar

            });

        this.isEditModalOpen = true;
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
            eleve.avatar = this.editForm.value.avatar;


            this.apiService.EditEleve(eleve).subscribe(
                (data: any) =>
                {
                    if (data.code == 200)
                    {
                        this.successEdit = true;
                        this.isEditModalOpen = false;
                    }
                    else
                        this.errorRegisterServer = true;
                },
                error =>
                {
                    if (error.status == 401)
                        this.errorRegisterServer = true;
                    else
                        this.errorRegisterServer = true;
                });


        }

    }









    OnDelete(user: Eleve)
    {

        this.selectedEleve = user;
        this.isDeleteModalOpen = true;
        console.log("id selectionné delete " + user.idEleve);

    }



    SubmitDeleteEleve(idEleve: number)
    {

        this.apiService.DeleteEleve(idEleve).subscribe(
            (data: any) =>
            {
                if (data.code == 200)
                {
                    this.successDelete = true;
                    this.isDeleteModalOpen = false;
                }
                else
                    this.errorRegisterServer = true;
            },
            error =>
            {
                if (error.status == 401)
                    this.errorRegisterServer = true;
                else
                    this.errorRegisterServer = true;
            });





    }












    ShowHistory(user: Eleve)
    {
        console.log("id selectionné history " + user.idEleve);
    }

    SelectPlayList(user: Eleve)
    {
        console.log("id selectionné playlist " + user.idEleve);
    }
}
