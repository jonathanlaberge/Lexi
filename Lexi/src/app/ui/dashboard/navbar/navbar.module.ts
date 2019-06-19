import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

@NgModule(
    {
        declarations: [NavbarComponent],
        imports: [
            RouterModule,
            CommonModule,
            BrowserAnimationsModule,
            ClarityModule,
        ],
        exports: [NavbarComponent]
    })
export class NavbarModule { }
