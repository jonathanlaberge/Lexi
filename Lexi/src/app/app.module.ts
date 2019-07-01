import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ClarityModule } from "@clr/angular";
import { EditorModule } from '@tinymce/tinymce-angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ConnectionComponent } from './pages/connection/connection.component';


import { TableauDeBordMaitresseComponent } from './pages/tableau-de-bord-maitresse/tableau-de-bord-maitresse.component';

import { EleveComponent } from './pages/tableau-de-bord-maitresse/eleve/eleve.component';
import { EleveFicheARemplirComponent } from './pages/tableau-de-bord-maitresse/eleve/eleve-fiche-aremplir/eleve-fiche-aremplir.component';
import { EleveCreationComponent } from './pages/tableau-de-bord-maitresse/eleve/eleve-creation/eleve-creation.component';
import { EleveStatistiqueComponent } from './pages/tableau-de-bord-maitresse/eleve/eleve-statistique/eleve-statistique.component';

import { QCMComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm.component';
import { QCMCreationCategorieComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm-creation-categorie/qcm-creation-categorie.component';
import { QCMCreationFicheComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm-creation-fiche/qcm-creation-fiche.component';
import { QCMModificationCategorieComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm-modification-categorie/qcm-modification-categorie.component';
import { QCMModificationFicheComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm-modification-fiche/qcm-modification-fiche.component';


import { TableauDeBordEleveComponent } from './pages/tableau-de-bord-eleve/tableau-de-bord-eleve.component';

import { EleveFicheComponent } from './pages/tableau-de-bord-eleve/eleve-fiche/eleve-fiche.component';
import { EleveQCMComponent } from './pages/tableau-de-bord-eleve/eleve-qcm/eleve-qcm.component';
import { EleveHistoriqueComponent } from './pages/tableau-de-bord-eleve/eleve-historique/eleve-historique.component';

import { SidebarModule } from './ui/dashboard/sidebar/sidebar.module';
import { NavbarModule } from './ui/dashboard/navbar/navbar.module';
import { FooterModule } from './ui/dashboard/footer/footer.module';
import { CurseursModule } from './ui/curseurs/curseurs.module';



import { AngularFontAwesomeModule } from 'angular-font-awesome';


@NgModule(
    {
        declarations:
            [
                AppComponent,
                ConnectionComponent,
                TableauDeBordMaitresseComponent,
                EleveComponent,
                EleveFicheARemplirComponent,
                EleveCreationComponent,
                EleveStatistiqueComponent,
                QCMComponent,
                QCMCreationCategorieComponent,
                QCMCreationFicheComponent,
                QCMModificationCategorieComponent,
                QCMModificationFicheComponent,
                EleveFicheComponent,
                EleveQCMComponent,
                EleveHistoriqueComponent,
                TableauDeBordEleveComponent
            ],
        imports:
            [
                FormsModule,
                BrowserModule,
                RouterModule,
                AngularFontAwesomeModule,
                HttpClientModule,
                AppRoutingModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                ClarityModule,
                EditorModule,
                SidebarModule,
                NavbarModule,
                FooterModule,
                CurseursModule
            ],
        providers: [],
        bootstrap: [AppComponent]
    })
export class AppModule { }
