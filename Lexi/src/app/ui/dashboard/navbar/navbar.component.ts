import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoutingService } from 'src/app/service/routing.service';
import { APIService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
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
    showProfileModal: boolean = false;

    errorServer: boolean = false;
    errorLogin: boolean = false;

    name: string = null;

    loginPassword: string = null;
    loginIsReady: boolean = false;

    subscriptionRoutingService: Subscription;
    subscriptionAccountControllerMode: Subscription;
    subscriptionAccountControllerProfilUpdate: Subscription;

    
    prenom: string;
    nom: string;
    motdepasseConfirmation: string;
    motdepasse: string;
    motdepasse2: string;

    mismatch: boolean = false;
    passwordLength: boolean = false;
    currentPasswordError: boolean = false;

    isLoadingModal: boolean = false;


    constructor(private router: Router, private apiService: APIService) { }

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

        if (this.subscriptionAccountControllerMode != null)
            this.subscriptionAccountControllerMode.unsubscribe();

        if (this.subscriptionAccountControllerProfilUpdate != null)
            this.subscriptionAccountControllerProfilUpdate.unsubscribe();
    }

    ShowProfile()
    {
        this.prenom = APIService.currentMaitresse.prenom;
        this.nom = APIService.currentMaitresse.nom;

        this.errorServer = false;
        this.showProfileModal = true;
    }

    SubmitAdminMode()
    {
        var args = { motdepasse: this.loginPassword };

        this.subscriptionAccountControllerMode =
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

    GoToTableauDeBord()
    {
        if (APIService.IsTokenInAdminMode())
            this.router.navigate(['/tableaudebord']);
        else
            this.showLoginModal = true;
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

    CloseProfile()
    {
        this.motdepasseConfirmation = "";
        this.motdepasse = "";
        this.motdepasse2 = "";
        this.showProfileModal = false;
    }
    
    SubmitEditProfile()
    {
        var maitresse: Maitresse = new Maitresse();

        maitresse.idMaitresse = APIService.currentMaitresse.idMaitresse;
        maitresse.nom = this.nom;
        maitresse.prenom = this.prenom;
        maitresse.motdepasseConfirmation = this.motdepasseConfirmation;
        maitresse.motdepasse = this.motdepasse;

        this.subscriptionAccountControllerProfilUpdate =
            this.apiService.AccountController_ProfilUpdate(maitresse).subscribe(
                (data: any) =>
                {
                    this.isLoadingModal = false;
                    if (data.code == 200)
                    {
                        this.CloseProfile();
                    }
                    else
                        this.errorServer = true;
                },
                (error) =>
                {
                    this.isLoadingModal = false;
                    switch (error.status)
                    {
                        case 401:
                            this.currentPasswordError = true;
                            break;

                        default:
                            this.errorServer = true;
                            break;
                    }
                });
    }

    CheckPassword(): boolean
    {
        if (this.motdepasse.length < 8)
            this.passwordLength = true;
        else
            this.passwordLength = false;

        if (this.motdepasse2 != this.motdepasse)
            this.mismatch = true;
        else
            this.mismatch = false;

        if (this.mismatch || this.passwordLength)
            return true;

        return false;
    }
}
