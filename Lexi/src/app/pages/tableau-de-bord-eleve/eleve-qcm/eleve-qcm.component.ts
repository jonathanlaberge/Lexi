import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QCMColor } from 'src/app/model/qcm-color.enum';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FicheDTO } from 'src/app/model/dto/ficheDTO';
import { Question } from 'src/app/model/question';
import { Alert } from 'selenium-webdriver';

@Component(
    {
        selector: 'app-eleve-qcm',
        templateUrl: './eleve-qcm.component.html',
        styleUrls: ['./eleve-qcm.component.css']
    })
export class EleveQCMComponent implements OnInit {
    answers = ["sdtdsff", "dsfsdfsdfsf", "dsfsdfsdfsf", "dsfsdfsdfsf"];
    testcolor = QCMColor.Green;


    idCategorie: number;
    idFiche: number;

    titre: string;



    color: QCMColor[] = [];



    errorRegisterServer: boolean = false;

    isDesable: boolean = true;
    isReady: boolean;
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






    reponseList = new Map();


    listQuestion: Question[] = [];









    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private route: ActivatedRoute

    ) { }







    ngOnInit() {


        this.activeRoute.params.subscribe(params => {
            if (!isNaN(parseFloat(params['idCategorie'])) && !isNaN(parseFloat(params['idFiche']))) {
                this.idCategorie = params['idCategorie'];
                this.idFiche = params['idFiche'];
            }
        });




        this.apiService.GetFicheQuestion(this.idCategorie, this.idFiche).subscribe((data: any) => {
            if (data != null) {
                this.titre = data.titre;

                data.listeQuestion.forEach(function (value) {
                    value.choixDeReponses = JSON.parse(value.choixDeReponses)
                    this.listQuestion.push(value as Question);
                }.bind(this));
            }

            this.isReady = true;
            this.ref.detectChanges();
        });
    }





    validationDesSliders(reponseSlider: number, idReponse: number) {
        console.log({ i: reponseSlider, j: idReponse });

        this.reponseList.set(idReponse, reponseSlider);

        // activation du boutton ou non selon une réponse non selectionnée.
        for (let value of this.reponseList.values()) {
            if (value == 0) {
                this.isDesable = true;
                break;
            } else
                this.isDesable = false;
        }
    }






    validation() {
        console.log("this.reponseList " + this.reponseList.size);
        /* "idFiche": 19,
             "idCategorie": 4,
                 "listeQuestion": [3, 3, 2, 3]


        this.idCategorie
        this.idFiche*/



        var listeReponse: number[] = [];


        for (let i = 1; i <= this.reponseList.size; i++) {
            listeReponse.push(this.reponseList.get(i))
        }



        this.apiService.FicheValidation({ idCategorie: this.idCategorie, idFiche: this.idFiche, listeReponseEleve: listeReponse }).subscribe(
            (data: any) => {
                if (data != null) {


                    console.log(data);
                    data.correction


                    /*this.color[0] = QCMColor.Green;
                    this.color[1] = QCMColor.Red;*/
                    // s'il n'y a pas d'erreur 
                    if (data.nombreErreur == 0) {

                        window.alert("Bravo, 100%");
                        this.router.navigate([`../`], { relativeTo: this.route });
                    }


                    // s'il y a des erreurs
                    for (let i = 1; i <= this.reponseList.size; i++) {
                        if (data.bonnesReponses[i] == true) {
                            console.log("question [" + (i ) + "] true");
                        } else {
                            this.color[1]
                            console.log("question [" + (i ) + "] false");
                        }


                    }

                    window.alert("Bravo, 100%");
                    this.router.navigate([`../`], { relativeTo: this.route });

                }
                else
                    this.errorRegisterServer = true;
            },
            error => {
                if (error.status == 401)
                    this.errorRegisterServer = true;
                else
                    this.errorRegisterServer = true;
            });


        console.log("this.keys " + listeReponse);

    }
















}
