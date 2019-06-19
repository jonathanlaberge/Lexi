import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurseurSimpleComponent } from './curseur-simple/curseur-simple.component';
import { CurseurCirculaireComponent } from './curseur-circulaire/curseur-circulaire.component';
import { CurseurTriangulaireComponent } from './curseur-triangulaire/curseur-triangulaire.component';
import { CurseurImageComponent } from './curseur-image/curseur-image.component';

@NgModule(
    {
        declarations: [CurseurSimpleComponent, CurseurCirculaireComponent, CurseurTriangulaireComponent, CurseurImageComponent],
        imports: [
            CommonModule
        ],
        exports: [CurseurSimpleComponent, CurseurCirculaireComponent, CurseurTriangulaireComponent, CurseurImageComponent]
    })
export class CurseursModule { }
