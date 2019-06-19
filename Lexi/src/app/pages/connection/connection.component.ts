import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ClrForm } from '@clr/angular';




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





    isRegisterModalOpen: boolean = false;


    constructor(private formBuilder: FormBuilder) {

    }




    ngOnInit() {
        this.loginForm = this.formBuilder.group({
       
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],

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
            motdepass: ['', [Validators.required, Validators.minLength(8)]],
            confirmationmotdepass: ['', [Validators.required, Validators.minLength(8)]],
            prenom: ['', [Validators.required]],
            nom: ['', [Validators.required,]],
            dateNaissance: ['', []],
            genre: ['', []]

        }, {
                validator: MustMatch('motdepass', 'confirmationmotdepass'),
          }
        );
    }


    get errorMessage() { return this.loginForm.controls; }





    submit() {
        if (this.loginForm.invalid) {
            this.loginClrForm.markAsTouched();
        } else {

            //this.loginForm.value.email;
            //  this.loginForm.value.password;

            console.log(this.loginForm.value);
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
