import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ClrForm } from '@clr/angular';
import { Maitresse } from 'src/app/model/maitresse';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { ConnectionDTO } from 'src/app/model/dto/connection-dto';
import { RoutingService } from 'src/app/service/routing.service';




@Component({
    selector: 'app-connection',
    templateUrl: './connection.component.html',
    styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {
    @ViewChild(ClrForm, { static: true }) loginClrForm;
    @ViewChild(ClrForm, { static: true }) registerClrForm;


    loginForm: FormGroup;
    registerForm: FormGroup;



    return: string = '';
    isRegisterModalOpen: boolean = false;

    erreurLogin: boolean = false;
    erreurServeur: boolean = false;
    erreurEmail: boolean = false;
    erreurServeurModal: boolean = false;


















    constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private apiService: APIService) {

    }




    ngOnInit() {
        this.loginForm = this.formBuilder.group({

            email: ['', [Validators.required, Validators.email]],
            motdepasse: ['', [Validators.required, Validators.minLength(8)]],

        }//, {
            //  validator: MustMatch('password', 'confirmPassword')
            // }
        );

        this.registerForm = this.formBuilder.group({

            email: ['', [Validators.required, Validators.email]],
            motdepasse: ['', [Validators.required, Validators.minLength(8)]],
            confirmationmotdepasse: ['', [Validators.required, Validators.minLength(8)]],
            prenom: ['', [Validators.required]],
            nom: ['', [Validators.required,]],
            dateNaissance: ['', []],
            genre: ['', []]

        }, {
                validator: MustMatch('motdepasse', 'confirmationmotdepasse'),
            }
        );



        /*localStorage.setItem('maitresseInfo', JSON.stringify(APIService.currentMaitresse));
        localStorage.setItem('token', JSON.stringify(APIService.token));*/



        if (localStorage.getItem('maitresseInfo') != null && localStorage.getItem('token') != null ) {

            APIService.currentMaitresse = JSON.parse(localStorage.getItem('maitresseInfo')) as Maitresse;


            RoutingService.isLoggedIn = true;
            RoutingService.adminMode = true;
            APIService.token = JSON.parse(localStorage.getItem('token'));

           RoutingService.SetRouteToAdmin();

        }

            







        this.route.queryParams.subscribe(params => {
            this.return = params['return'] || '/tableaudebord';
            if (RoutingService.isLoggedIn == true)
                this.router.navigateByUrl(this.return);
        });





    }


    get errorMessage() { return this.loginForm.controls; }





    submit() {
        if (this.loginForm.invalid) {
            this.loginClrForm.markAsTouched();
            console.log("bad value");
        }

        else {

            //this.loginForm.value.email;
            //  this.loginForm.value.password;

            console.log(this.loginForm.value);
            console.log(this.loginForm.value.email);
            console.log(this.loginForm.value.motdepasse);







            var credential: ConnectionDTO;





            var maitresse: Maitresse = new Maitresse();
            maitresse.motdepasse = this.loginForm.value.motdepasse as string;
            maitresse.email = this.loginForm.value.email as string;



            this.apiService.Connection(maitresse).subscribe((data: any) => {
                if (data != null) {
                    // error credentiel
                    APIService.currentMaitresse = null;

                }

                if(data.token) {
                    credential = (data as ConnectionDTO);


                    APIService.currentMaitresse = (credential.account as Maitresse);


                    //CONTINUE IF LOGIN VALID
                    RoutingService.SetRouteToAdmin();
                    RoutingService.isLoggedIn = true;
                    RoutingService.adminMode = true;
                    APIService.token = credential.token;



                    localStorage.setItem('maitresseInfo', JSON.stringify(APIService.currentMaitresse));
                    localStorage.setItem('token', JSON.stringify(APIService.token));

                    this.router.navigateByUrl(this.return);
                }

            
            });

        }


    }










    openRegisterModalForm() {
        this.isRegisterModalOpen = true;
    }




    registerModalForm() {



        if (this.registerForm.invalid) {
            this.registerClrForm.markAsTouched();
            console.log("bad value");

        } else {

            //this.loginForm.value.email;
            //  this.loginForm.value.password;

            console.log(this.registerForm.value);



            var maitresse: Maitresse = new Maitresse();


            maitresse.motdepasse = this.registerForm.value.motdepasse as string;
            maitresse.email = this.registerForm.value.email as string;
            maitresse.prenom = this.registerForm.value.prenom as string;
            maitresse.nom = this.registerForm.value.nom as string;

           
            maitresse.dateNaissance = this.registerForm.value.dateNaissance as Date;

            maitresse.genre = this.registerForm.value.genre as number;



            this.apiService.Enregistrement(maitresse).subscribe((data: any) => {











                if (data.code == 401) {

                    this.erreurEmail = false;
                }
                else if (data.code == 500)
                {
                    this.erreurServeurModal = false;
                } else if (data.code == 400) {

                    this.erreurEmail = false;
                }

            });



            


           // this.isRegisterModalOpen = !this.isRegisterModalOpen;
        }
    }








    resetRegisterModalForm() {
        this.registerForm.reset();
    }
}


export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }

    }
}
