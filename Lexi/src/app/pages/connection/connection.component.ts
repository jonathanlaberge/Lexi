import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";



@Component({
    selector: 'app-connection',
    templateUrl: './connection.component.html',
    styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {


   
    loginForm: FormGroup;
    password: string;
    email: string;
    
    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
       
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],

        }, {
              //  validator: MustMatch('password', 'confirmPassword')
            });


    }


    get errorMessage() { return this.loginForm.controls; }
    






    resetForm() {
        this.loginForm.reset();
    }



    submit() {
        if (this.loginForm.invalid) {
           // this.clrForm.markAsTouched();
        } else {
            console.log(this.loginForm.value);
        }


    }





}
