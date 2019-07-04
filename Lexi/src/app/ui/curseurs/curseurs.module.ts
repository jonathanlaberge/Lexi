import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurseurSimpleComponent } from './curseur-simple/curseur-simple.component';
import { CurseurCirculaireComponent } from './curseur-circulaire/curseur-circulaire.component';
import { CurseurImageComponent } from './curseur-image/curseur-image.component';
import { SafeHTMLStylePipe } from './pipe/safe-html-style.pipe';

@NgModule(
    {
        declarations: [CurseurSimpleComponent, CurseurCirculaireComponent, CurseurImageComponent, SafeHTMLStylePipe],
        imports: [CommonModule],
        exports: [CurseurSimpleComponent, CurseurCirculaireComponent, CurseurImageComponent]
    })
export class CurseursModule { }
