import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoutingService } from 'src/app/service/routing.service';
import { APIService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ClrForm, fade } from '@clr/angular';
import { Maitresse } from 'src/app/model/maitresse';

@Component(
    {
        selector: 'dashboard-navbar',
        templateUrl: './navbar.component.html'
    })
export class NavbarComponent implements OnInit, OnDestroy {


    isAdmin: boolean = false;
    eleveConnected: boolean = false;
    showLoginModal: boolean = false;

    isEditModalOpen: boolean = false;
    errorServer: boolean = false;



    errorLogin: boolean = false;

    name: string = null;

    loginPassword: string = null;
    loginIsReady: boolean = false;
    motdepasseConfirmation: string;

    subscriptionRoutingService: Subscription;
    isLoadingModal: boolean = false;
    prenom: string;
    nom: string;


    motdepasse2: string;
    motdepasse: string;
    mismatch: boolean = true;
    passwordLenght: boolean = false;
    currentPasswordError: boolean = false;


    constructor(private router: Router, private formBuilder: FormBuilder, private apiService: APIService) { }

    ngOnInit() {
        this.isAdmin = RoutingService.adminMode;
        this.eleveConnected = RoutingService.eleveConnected;
        this.name = `${APIService.currentMaitresse.prenom} ${APIService.currentMaitresse.nom}`;

        this.subscriptionRoutingService = RoutingService.routeSubject.subscribe(() => {
            this.isAdmin = RoutingService.adminMode;
            this.eleveConnected = RoutingService.eleveConnected;
            this.name = `${APIService.currentMaitresse.prenom} ${APIService.currentMaitresse.nom}`;
        });

    }









    ngOnDestroy() {
        if (this.subscriptionRoutingService != null)
            this.subscriptionRoutingService.unsubscribe();
    }

    ShowProfile() {
        // console.log(APIService.token);




        this.prenom = APIService.currentMaitresse.prenom;

        this.nom = APIService.currentMaitresse.nom;




        this.errorServer = false;
        this.isEditModalOpen = true;
    }


    closeEdit() {


        this.motdepasseConfirmation = "";
        this.motdepasse = "";
        this.motdepasse2 = "";
        this.isEditModalOpen = false;


    }



    SubmitEdit() {

        var maitresse: Maitresse = new Maitresse();




        maitresse.idMaitresse = APIService.currentMaitresse.idMaitresse;
        maitresse.nom = this.nom;
        maitresse.prenom = this.prenom;
        maitresse.motdepasseConfirmation = this.motdepasseConfirmation;
        maitresse.motdepasse = this.motdepasse;
        console.log(maitresse)



        this.apiService.AccountController_ProfilUpdate(maitresse).subscribe(
            (data: any) => {
                this.isLoadingModal = false;
                if (data.code == 200) {
                    this.closeEdit();
                }
                else
                    this.errorServer = true;
            },
            (error) => {
                this.isLoadingModal = false;
                switch (error.status) {

                    case 401: this.currentPasswordError = true;
                        break;
                    default:

                        this.errorServer = true;

                        break;

                }
            });

    }











    GoToTableauDeBord() {
        if (APIService.IsTokenInAdminMode())
            this.router.navigate(['/tableaudebord']);
        else
            this.showLoginModal = true;
    }

    SubmitAdminMode() {
        var args = { motdepasse: this.loginPassword };

        this.apiService.AccountController_Mode(args).subscribe(
            (data: any) => {
                if (data.token != null) {
                    APIService.token = data.token;
                    localStorage.setItem('token', JSON.stringify(APIService.token));
                    RoutingService.adminMode = true;
                    RoutingService.eleveConnected = false;
                    RoutingService.SetRouteToAdmin();


                    this.errorServer = false;
                    this.loginIsReady = true;
                    this.router.navigate(['/tableaudebord']);
                }
                else {
                    this.errorServer = true;
                    this.loginIsReady = true;
                }

            },
            error => {
                if (error.status == 401)
                    this.errorLogin = true;
                else
                    this.errorServer = true;

                this.loginIsReady = true;
            });
    }

    GoToElevePortail() {
        this.router.navigate(['/eleve']);
    }

    Logout() {
        RoutingService.Logout();

        this.router.navigate(['/']);
    }












    confirmPassword() {

        if (this.motdepasseConfirmation.length <= 8)
            this.passwordLenght = true;
        else
            this.passwordLenght = false;

        if (this.motdepasse2 != this.motdepasse) {

            console.log(" error ");
            this.mismatch = true;

        } else {
            this.mismatch = false;
        }


    }

}
