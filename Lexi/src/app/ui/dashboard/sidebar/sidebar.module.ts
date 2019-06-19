import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

@NgModule(
    {
        declarations: [SidebarComponent],
        imports: [
            RouterModule,
            CommonModule,
            BrowserAnimationsModule,
            ClarityModule,
        ],
        exports: [SidebarComponent]
    })
export class SidebarModule { }
