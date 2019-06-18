import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ClarityModule } from "@clr/angular";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ConnectionComponent } from './pages/connection/connection.component';

import { TableauDeBordComponent } from './pages/tableau-de-bord/tableau-de-bord.component';

import { EleveComponent } from './pages/tableau-de-bord/eleve/eleve.component';
import { EleveFicheARemplirComponent } from './pages/tableau-de-bord/eleve/eleve-fiche-aremplir/eleve-fiche-aremplir.component';
import { EleveCreationComponent } from './pages/tableau-de-bord/eleve/eleve-creation/eleve-creation.component';
import { EleveStatistiqueComponent } from './pages/tableau-de-bord/eleve/eleve-statistique/eleve-statistique.component';

import { QCMComponent } from './pages/tableau-de-bord/qcm/qcm.component';
import { QCMCreationCategorieComponent } from './pages/tableau-de-bord/QCM/qcmcreation-categorie/qcmcreation-categorie.component';
import { QCMCreationFicheComponent } from './pages/tableau-de-bord/QCM/qcmcreation-fiche/qcmcreation-fiche.component';
import { QCMModificationCategorieComponent } from './pages/tableau-de-bord/QCM/qcmmodification-categorie/qcmmodification-categorie.component';
import { QCMModificationFicheComponent } from './pages/tableau-de-bord/QCM/qcmmodification-fiche/qcmmodification-fiche.component';
import { QCMStatistiqueComponent } from './pages/tableau-de-bord/QCM/qcmstatistique/qcmstatistique.component';

import { TableauDeBordEleveComponent } from './pages/tableau-de-bord-eleve/tableau-de-bord-eleve.component';
import { EleveFicheComponent } from './pages/tableau-de-bord-eleve/eleve-fiche/eleve-fiche.component';
import { EleveQCMComponent } from './pages/tableau-de-bord-eleve/eleve-qcm/eleve-qcm.component';
import { EleveHistoriqueComponent } from './pages/tableau-de-bord-eleve/eleve-historique/eleve-historique.component';

@NgModule(
    {
        declarations:
            [
                AppComponent,
                ConnectionComponent,
                TableauDeBordComponent,
                EleveComponent,
                EleveFicheARemplirComponent,
                EleveCreationComponent,
                EleveStatistiqueComponent,
                QCMComponent,
                QCMCreationCategorieComponent,
                QCMCreationFicheComponent,
                QCMModificationCategorieComponent,
                QCMModificationFicheComponent,
                QCMStatistiqueComponent,
                EleveFicheComponent,
                EleveQCMComponent,
                EleveHistoriqueComponent,
                TableauDeBordEleveComponent
            ],
        imports:
            [
                BrowserModule,
                AppRoutingModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                ClarityModule,
            ],
        providers: [],
        bootstrap: [AppComponent]
    })
export class AppModule { }
