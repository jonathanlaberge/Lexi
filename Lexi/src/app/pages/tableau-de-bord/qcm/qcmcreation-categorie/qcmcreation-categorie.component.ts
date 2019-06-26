import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qcmcreation-categorie',
  templateUrl: './qcmcreation-categorie.component.html',
  styleUrls: ['./qcmcreation-categorie.component.css']
})
export class QCMCreationCategorieComponent implements OnInit {


    @ViewChild(ClrForm, { static: true }) addCategorieFormValidator;

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
                nom: ['', [Validators.required]],
                matiere: ['', [Validators.required]],
                Niveau: ['',],
                estPublic: ['', [Validators.required]]

            });
    }

    




}
