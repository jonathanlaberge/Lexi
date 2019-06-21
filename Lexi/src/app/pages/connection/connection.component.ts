import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ClrForm } from '@clr/angular';
import { Maitresse } from 'src/app/model/maitresse';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConnectionDTO } from 'src/app/model/dto/connection-dto';
import { RoutingService } from 'src/app/service/routing.service';

@Component(
    {
        selector: 'app-connection',
        templateUrl: './connection.component.html',
        styleUrls: ['./connection.component.css']
    })
export class ConnectionComponent implements OnInit
{
    @ViewChild(ClrForm, { static: true }) loginClrForm;
    @ViewChild(ClrForm, { static: true }) registerClrForm;


    loginForm: FormGroup;
    registerForm: FormGroup;

    return: string = '';
    isRegisterModalOpen: boolean = false;

    errorLoginInvalid: boolean = false;
    errorLoginServer: boolean = false;
    successRegister: boolean = false;
    errorRegisterExist: boolean = false;
    errorRegisterServer: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private apiService: APIService) { }

    ngOnInit()
    {
        this.loginForm = this.formBuilder.group(
            {
                email: ['', [Validators.required, Validators.email]],
                motdepasse: ['', [Validators.required, Validators.minLength(8)]]
            });

        this.registerForm = this.formBuilder.group(
            {
                email: ['', [Validators.required, Validators.email]],
                motdepasse: ['', [Validators.required, Validators.minLength(8)]],
                confirmationmotdepasse: ['', [Validators.required, Validators.minLength(8)]],
                prenom: ['', [Validators.required]],
                nom: ['', [Validators.required,]],
                dateNaissance: ['', []],
                genre: ['', []]
            },
            {
                validator: MustMatch('motdepasse', 'confirmationmotdepasse'),
            });

        if (localStorage.getItem('maitresseInfo') != null && localStorage.getItem('token') != null)
        {
            APIService.currentMaitresse = JSON.parse(localStorage.getItem('maitresseInfo')) as Maitresse;

            RoutingService.isLoggedIn = true;
            RoutingService.adminMode = true;
            APIService.token = JSON.parse(localStorage.getItem('token'));

            RoutingService.SetRouteToAdmin
        }

        this.route.queryParams.subscribe(params =>
        {
            this.return = params['return'] || '/tableaudebord';
            if (RoutingService.isLoggedIn == true)
                this.router.navigateByUrl(this.return);
        });
    }

    get errorMessage()
    {
        return this.loginForm.controls;
    }

    submitLogin()
    {
        this.errorLoginInvalid = false;
        this.errorLoginServer = false;
        this.successRegister = false;
        this.errorRegisterExist = false;
        this.errorRegisterServer = false;

        if (this.loginForm.invalid)
        {
            this.loginClrForm.markAsTouched();
            this.errorLoginInvalid = true;
        }
        else
        {
            var maitresse: Maitresse = new Maitresse();

            maitresse.motdepasse = this.loginForm.value.motdepasse;
            maitresse.email = this.loginForm.value.email;

            this.apiService.Connection(maitresse).subscribe(
                (data: any) =>
                {
                    if (data.token != null)
                    {
                        var credential: ConnectionDTO;
                        credential = (data as ConnectionDTO);
                        
                        APIService.currentMaitresse = (credential.account as Maitresse);
                        
                        RoutingService.SetRouteToAdmin();
                        RoutingService.isLoggedIn = true;
                        RoutingService.adminMode = true;
                        APIService.token = credential.token;
                        
                        localStorage.setItem('maitresseInfo', JSON.stringify(APIService.currentMaitresse));
                        localStorage.setItem('token', JSON.stringify(APIService.token));

                        this.router.navigateByUrl(this.return);
                    }
                    else
                        this.errorLoginServer = true;
                },
                error =>
                {
                    if (error.status == 401)
                        this.errorLoginInvalid = true;
                    else
                        this.errorLoginServer = true;
                }
            );
        }
    }

    openRegisterModalForm()
    {
        this.isRegisterModalOpen = true;
    }

    submitRegister()
    {
        this.errorLoginInvalid = false;
        this.errorLoginServer = false;
        this.successRegister = false;
        this.errorRegisterExist = false;
        this.errorRegisterServer = false;

        if (this.registerForm.invalid)
        {
            this.registerClrForm.markAsTouched();
        }
        else
        {
            var maitresse: Maitresse = new Maitresse();

            maitresse.motdepasse = this.registerForm.value.motdepasse;
            maitresse.email = this.registerForm.value.email;
            maitresse.prenom = this.registerForm.value.prenom;
            maitresse.nom = this.registerForm.value.nom;
            maitresse.dateNaissance = this.registerForm.value.dateNaissance as Date;
            maitresse.genre = this.registerForm.value.genre;

            this.apiService.Enregistrement(maitresse).subscribe(
                (data: any) =>
                {
                    if (data.code == 200)
                    {
                        this.successRegister = true;
                        this.isRegisterModalOpen = false;
                    }
                    else
                        this.errorRegisterServer = true;
                },
                error =>
                {
                    if (error.status == 401)
                        this.errorRegisterExist = true;
                    else
                        this.errorRegisterServer = true;
                });
        }
    }
}

export function MustMatch(controlName: string, matchingControlName: string)
{
    return (formGroup: FormGroup) =>
    {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch)
        {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value)
        {
            matchingControl.setErrors({ mustMatch: true });
        }
        else
        {
            matchingControl.setErrors(null);
        }

    }
}
