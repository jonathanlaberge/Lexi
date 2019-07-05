import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoutingService } from 'src/app/service/routing.service';
import { APIService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ClrForm } from '@clr/angular';
import { Maitresse } from 'src/app/model/maitresse';

@Component(
    {
        selector: 'dashboard-navbar',
        templateUrl: './navbar.component.html'
    })
export class NavbarComponent implements OnInit, OnDestroy
{


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
    motdepasse: string;
    confirmationmotdepasse: string;

    constructor(private router: Router, private formBuilder: FormBuilder,private apiService: APIService) { }

    ngOnInit()
    {
        this.isAdmin = RoutingService.adminMode;
        this.eleveConnected = RoutingService.eleveConnected;
        this.name = `${APIService.currentMaitresse.prenom} ${APIService.currentMaitresse.nom}`;

        this.subscriptionRoutingService = RoutingService.routeSubject.subscribe(() => 
        {
            this.isAdmin = RoutingService.adminMode;
            this.eleveConnected = RoutingService.eleveConnected;
            this.name = `${APIService.currentMaitresse.prenom} ${APIService.currentMaitresse.nom}`;
        });

    }








    
    ngOnDestroy()
    {
        if (this.subscriptionRoutingService != null)
            this.subscriptionRoutingService.unsubscribe();
    }

    ShowProfile()
    {
       // console.log(APIService.token);


         
               
        this.prenom = APIService.currentMaitresse.prenom;
                   
        this.nom = APIService.currentMaitresse.nom;
                



            this.errorServer = false;
            this.isEditModalOpen = true;
    }






    SubmitEdit() {

        var maitresse: Maitresse = new Maitresse();




        maitresse.idMaitresse = APIService.currentMaitresse.idMaitresse;
        maitresse.nom = this.nom;
        maitresse.prenom = this.prenom;
        maitresse.motdepasse = this.confirmationmotdepasse;

        console.log(maitresse)


        if (this.confirmationmotdepasse.length <= 8)
            this.errorServer = false;
        else       
            this.apiService.AccountController_ProfilUpdate(maitresse).subscribe(
                    (data: any) => {
                        this.isLoadingModal = false;
                        if (data.code == 200) {
                           
                            this.isEditModalOpen = false;
                        }
                        else
                            this.errorServer = true;
                    },
                    () => {
                        this.isLoadingModal = false;
                        this.errorServer = true;
                    });
        
    }











    GoToTableauDeBord()
    {
        if (APIService.IsTokenInAdminMode())
            this.router.navigate(['/tableaudebord']);
        else
            this.showLoginModal = true;
    }

    SubmitAdminMode()
    {
        var args = { motdepasse: this.loginPassword };

        this.apiService.AccountController_Mode(args).subscribe(
            (data: any) =>
            {
                if (data.token != null)
                {
                    APIService.token = data.token;
                    localStorage.setItem('token', JSON.stringify(APIService.token));
                    RoutingService.adminMode = true;
                    RoutingService.eleveConnected = false;
                    RoutingService.SetRouteToAdmin();
                    this.errorServer = false;
                    this.loginIsReady = true;
                    this.router.navigate(['/tableaudebord']);
                }
                else
                {
                    this.errorServer = true;
                    this.loginIsReady = true;
                }
                
            },
            error =>
            {
                if (error.status == 401)
                    this.errorLogin = true;
                else
                    this.errorServer = true;

                this.loginIsReady = true;
            });
    }

    GoToElevePortail()
    {
        this.router.navigate(['/eleve']);
    }

    Logout()
    {
        RoutingService.Logout();

        this.router.navigate(['/']);
    }
}
