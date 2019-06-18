import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectionComponent } from './pages/connection/connection.component';
import { TableauDeBordComponent } from './pages/tableau-de-bord/tableau-de-bord.component';
import { EleveComponent } from './pages/tableauDeBord/eleve/eleve.component';
import { CreationComponent } from './pages/tableauDeBord/eleve/creation/creation.component';
import { FicheARemplirComponent } from './pages/tableauDeBord/eleve/fiche-aremplir/fiche-aremplir.component';
import { EleveFicheARemplirComponent } from './pages/tableauDeBord/eleve/eleve-fiche-aremplir/eleve-fiche-aremplir.component';
import { EleveCreationComponent } from './pages/tableauDeBord/eleve/eleve-creation/eleve-creation.component';
import { QCMCreationComponent } from './pages/tableauDeBord/QCM/qcmcreation/qcmcreation.component';
import { QCMCreationCategorieComponent } from './pages/tableauDeBord/QCM/qcmcreation-categorie/qcmcreation-categorie.component';
import { QCMCreationFicheComponent } from './pages/tableauDeBord/QCM/qcmcreation-fiche/qcmcreation-fiche.component';
import { QCMModificationCategorieComponent } from './pages/tableauDeBord/QCM/qcmmodification-categorie/qcmmodification-categorie.component';
import { QCMModificationFicheComponent } from './pages/tableauDeBord/QCM/qcmmodification-fiche/qcmmodification-fiche.component';
import { QCMStatistiqueComponent } from './pages/tableauDeBord/QCM/qcmstatistique/qcmstatistique.component';
import { EleveStatistiqueComponent } from './pages/tableauDeBord/eleve/eleve-statistique/eleve-statistique.component';
import { EleveFicheComponent } from './pages/eleve/eleve-fiche/eleve-fiche.component';
import { QCMComponent } from './pages/eleve/qcm/qcm.component';
import { EleveQCMComponent } from './pages/eleve/eleve-qcm/eleve-qcm.component';
import { EleveHistoriqueComponent } from './pages/eleve/eleve-historique/eleve-historique.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    TableauDeBordComponent,
    EleveComponent,
    CreationComponent,
    FicheARemplirComponent,
    EleveFicheARemplirComponent,
    EleveCreationComponent,
    QCMCreationComponent,
    QCMCreationCategorieComponent,
    QCMCreationFicheComponent,
    QCMModificationCategorieComponent,
    QCMModificationFicheComponent,
    QCMStatistiqueComponent,
    EleveStatistiqueComponent,
    EleveFicheComponent,
    QCMComponent,
    EleveQCMComponent,
    EleveHistoriqueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
