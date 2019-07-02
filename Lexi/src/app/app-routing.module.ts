import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './service/admin.guard';
import { ConnectionComponent } from './pages/connection/connection.component';
import { TableauDeBordMaitresseComponent } from './pages/tableau-de-bord-maitresse/tableau-de-bord-maitresse.component';
import { EleveComponent } from './pages/tableau-de-bord-maitresse/eleve/eleve.component';
import { EleveCreationComponent } from './pages/tableau-de-bord-maitresse/eleve/eleve-creation/eleve-creation.component';
import { EleveFicheARemplirComponent } from './pages/tableau-de-bord-maitresse/eleve/eleve-fiche-a-remplir/eleve-fiche-a-remplir.component';
import { EleveStatistiqueComponent } from './pages/tableau-de-bord-maitresse/eleve/eleve-statistique/eleve-statistique.component';
import { QCMComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm.component';
import { QCMCreationCategorieComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm-creation-categorie/qcm-creation-categorie.component';
import { QCMCreationFicheComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm-creation-fiche/qcm-creation-fiche.component';
import { QCMModificationCategorieComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm-modification-categorie/qcm-modification-categorie.component';
import { QCMModificationFicheComponent } from './pages/tableau-de-bord-maitresse/qcm/qcm-modification-fiche/qcm-modification-fiche.component';
import { EleveGuard } from './service/eleve.guard';
import { TableauDeBordEleveComponent } from './pages/tableau-de-bord-eleve/tableau-de-bord-eleve.component';
import { EleveFicheComponent } from './pages/tableau-de-bord-eleve/eleve-fiche/eleve-fiche.component';
import { EleveQCMComponent } from './pages/tableau-de-bord-eleve/eleve-qcm/eleve-qcm.component';
import { EleveHistoriqueComponent } from './pages/tableau-de-bord-eleve/eleve-historique/eleve-historique.component';

const routes: Routes =
    [
        {
            path: '',
            redirectTo: 'connection',
            pathMatch: 'full',
        },
        {
            path: 'connection',
            component: ConnectionComponent
        },
        {
            path: 'tableaudebord',
            component: TableauDeBordMaitresseComponent,
            canActivate: [AdminGuard],
            children:
                [
                    {
                        path: 'eleve',
                        component: EleveComponent,
                        children:
                            [
                                { path: 'creation', component: EleveCreationComponent },
                                { path: 'fichearemplir', component: EleveFicheARemplirComponent },
                                { path: 'fichearemplir/:id', component: EleveFicheARemplirComponent },
                                { path: 'statistique', component: EleveStatistiqueComponent },
                                { path: 'statistique/:id', component: EleveStatistiqueComponent }
                            ]
                    },
                    {
                        path: 'qcm',
                        component: QCMComponent,
                        children:
                            [
                                { path: 'creationcategorie', component: QCMCreationCategorieComponent },
                                { path: 'creationfiche', component: QCMCreationFicheComponent },
                                { path: 'creationfiche/:id', component: QCMCreationFicheComponent },
                                { path: 'modificationcategorie', component: QCMModificationCategorieComponent },
                                { path: 'modificationcategorie/:id', component: QCMModificationCategorieComponent },
                                { path: 'modificationfiche', component: QCMModificationFicheComponent },
                                { path: 'modificationfiche/:idCategorie/:idFiche', component: QCMModificationFicheComponent }
                            ]
                    },
                ]
        },
        {
            path: 'eleve',
            component: TableauDeBordEleveComponent,
            canActivate: [EleveGuard],
            children:
                [
                    {
                        path: 'fiche',
                        component: EleveFicheComponent
                    },
                    {
                        path: 'qcm',
                        component: EleveQCMComponent
                    },
                    {
                        path: 'qcm/:idCategorie/:idFiche',
                        component: EleveQCMComponent
                    },
                    {
                        path: 'historique',
                        component: EleveHistoriqueComponent
                    },
                ]
        },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
