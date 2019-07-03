import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QCMColor } from 'src/app/model/qcm-color.enum';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FicheDTO } from 'src/app/model/dto/ficheDTO';
import { Question } from 'src/app/model/question';
import { Fiche } from 'src/app/model/fiche';

@Component(
    {
        selector: 'app-eleve-qcm',
        templateUrl: './eleve-qcm.component.html',
        styleUrls: ['./eleve-qcm.component.css']
    })
export class EleveQCMComponent implements OnInit
{
    fiche: Fiche;
    colorCurseur: QCMColor[] = [];

    isValidationButtonDisable: boolean = true;
    isReady: boolean = false;

    reponseList: Map<number, number> = new Map();

    canValidate: boolean = false;
    canContinue: boolean = false;

    isLoading: boolean = false;
    errorServer: boolean = false;

    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private activeRoute: ActivatedRoute) { }

    ngOnInit()
    {
        this.activeRoute.params.subscribe(params =>
        {
            if (!isNaN(parseFloat(params['idCategorie'])) && !isNaN(parseFloat(params['idFiche'])))
            {
                this.apiService.UserController_FicheGet(params['idCategorie'], params['idFiche']).subscribe(
                    (data) =>
                    {
                        this.fiche = data as Fiche;
                        
                        this.isReady = true;
                        this.ref.detectChanges();
                    },
                    () =>
                    {
                        this.errorServer = true;
                    });
            }
            else
                this.router.navigate([`/eleve/fiche`]);
        });
    }
    
    IsUsingDots(question: Question)
    {
        if (question.choixDeReponses.length != 0)
            if (question.choixDeReponses[0] == "<p hidden>useDots</p>")
                return true;

        return false;
    }
    
    OnChangeCurseur(reponseSlider: number, idReponse: number)
    {
        console.log({ i: reponseSlider, j: idReponse });

        this.reponseList.set(idReponse, reponseSlider);

        // Activation du boutton ou non selon une réponse non selectionnée.
        for (let value of this.reponseList.values())
        {
            if (value == 0)
            {
                this.canValidate = false;
                break;
            }
            else
                this.canValidate = true;
        }
    }

    //validation()
    //{
    //    console.log("this.reponseList " + this.reponseList.size);
    //    /* "idFiche": 19,
    //         "idCategorie": 4,
    //             "listeQuestion": [3, 3, 2, 3]


    //    this.idCategorie
    //    this.idFiche*/



    //    var listeReponse: number[] = [];


    //    for (let i = 1; i <= this.reponseList.size; i++)
    //    {
    //        listeReponse.push(this.reponseList.get(i))
    //    }



    //    this.apiService.UserController_FicheValidation({ idCategorie: this.idCategorie, idFiche: this.idFiche, listeReponseEleve: listeReponse }).subscribe(
    //        (data: any) =>
    //        {
    //            if (data != null)
    //            {


    //                console.log(data);
    //                data.correction


    //                /*this.color[0] = QCMColor.Green;
    //                this.color[1] = QCMColor.Red;*/
    //                // s'il n'y a pas d'erreur 
    //                if (data.nombreErreur == 0)
    //                {

    //                    window.alert("Bravo, 100%");
    //                    this.router.navigate([`../`], { relativeTo: this.route });
    //                }


    //                // s'il y a des erreurs
    //                for (let i = 1; i <= this.reponseList.size; i++)
    //                {
    //                    if (data.bonnesReponses[i] == true)
    //                    {
    //                        console.log("question [" + (i) + "] true");
    //                    } else
    //                    {
    //                        this.color[1]
    //                        console.log("question [" + (i) + "] false");
    //                    }


    //                }

    //                window.alert("Erreur trouvé.");
    //                this.router.navigate([`../`], { relativeTo: this.route });

    //            }
    //            else
    //                this.errorRegisterServer = true;
    //        },
    //        error =>
    //        {
    //            if (error.status == 401)
    //                this.errorRegisterServer = true;
    //            else
    //                this.errorRegisterServer = true;
    //        });


    //    console.log("this.keys " + listeReponse);

    //}
}
/*
     * envoie
       {
     "idFiche": 19,
     "idCategorie": 4,
     "listeQuestion": [3, 3, 2, 3]
   }



   recoit
   {
       "correction": [
           true,
           true,
           true,
           true
       ],
       "nombreErreur": 0,
       "bonnesReponses": {
           "1": 3,
           "2": 3,
           "3": 2,
           "4": 3,
           "5": 3,
           "6": 1,
           "7": 1,
           "8": 2,
           "9": 1,
           "10": 1,
           "11": 3,
           "12": 1
       }
   }

   */
