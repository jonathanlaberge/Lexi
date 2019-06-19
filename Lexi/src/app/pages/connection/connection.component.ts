import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ClrForm } from '@clr/angular';




@Component({
    selector: 'app-connection',
    templateUrl: './connection.component.html',
    styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {
    @ViewChild(ClrForm, { static: true }) clrForm;

   
    loginForm: FormGroup;

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


    }


    get errorMessage() { return this.loginForm.controls; }
    






    resetForm() {
        this.isRegisterModalOpen = true;



     //   this.loginForm.reset();
    }



    submit() {
        if (this.loginForm.invalid) {
            this.clrForm.markAsTouched();
        } else {

           //this.loginForm.value.email;
           //  this.loginForm.value.password;
          



            console.log(this.loginForm.value);
        }


    }





}
