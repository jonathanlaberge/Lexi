import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ClrForm } from '@clr/angular';
import { Maitresse } from 'src/app/model/maitresse';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
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



            /*
            	email
                motdepass
                prenom
                nom
                dateNaissance
                genre

            */

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



        this.route.queryParams.subscribe(params => {
            this.return = params['return'] || '/dashboard';
            if (RoutingService.isLoggedIn == true)
                this.router.navigateByUrl(this.return);
        });





    }


    get errorMessage() { return this.loginForm.controls; }





    submit() {
        if (this.loginForm.invalid) {
            this.loginClrForm.markAsTouched();
        }

        else {

            //this.loginForm.value.email;
            //  this.loginForm.value.password;

            console.log(this.loginForm.value);







           

           var credential: ConnectionDTO;
           
            



            var maitresse: Maitresse;
            maitresse.email = this.loginClrForm.value.email;
                maitresse.motdepasse = this.loginClrForm.value.password;


            this.apiService.Connection(maitresse).subscribe((data: any) => {
                if (data.code == 401) {
                    // error credentiel
                    APIService.currentMaitresse = null;


                    
                } else { 
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
                /*   //Error
                   else {
                     APIService.CurrentUser = null;
                      $.notify(
                          {
                              icon: "ti-alert",
                              message: "There was an error while logging in! Please try again later."
                          },
                          {
                              type: "danger", timer: 100,
                              placement: { from: "top", align: "center" }
                          });
   
                  }*/
            });

        }


    }










            openRegisterModalForm() {
                this.isRegisterModalOpen = true;
            }




            registerModalForm() {



                if (this.registerForm.invalid) {
                    this.registerClrForm.markAsTouched();
                    console.log(this.registerForm.value);

                } else {

                    //this.loginForm.value.email;
                    //  this.loginForm.value.password;

                    console.log(this.registerForm.value);
                    this.isRegisterModalOpen = !this.isRegisterModalOpen;

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
