import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { QCMColor } from 'src/app/model/qcm-color.enum';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Question } from 'src/app/model/question';
import { Fiche } from 'src/app/model/fiche';
import { FicheDTO } from 'src/app/model/dto/fiche-dto';
import { Subscription } from 'rxjs';

@Component(
    {
        selector: 'app-eleve-qcm',
        templateUrl: './eleve-qcm.component.html'
    })
export class EleveQCMComponent implements OnInit, OnDestroy
{
    fiche: Fiche;
    colorCurseur: QCMColor[] = [];
    disabledCurseur: boolean[] = [];

    isValidationButtonDisable: boolean = true;
    isReady: boolean = false;

    reponseList: Map<number, number> = new Map();
    errorNumber: number = 0;

    canValidate: boolean = false;
    canContinue: boolean = false;

    isLoading: boolean = false;
    errorServer: boolean = false;

    showSuccessModal: boolean = false;
    showErrorModal: boolean = false;
    showLoadingModal: boolean = false;

    qcmModeShowErrorOnValidation: boolean = false;
    qcmModeLimitNumberOfQuestion: number = 0;

    subscriptionParams: Subscription;
    subscriptionUserControllerFicheGet: Subscription;
    subscriptionUserControllerFicheValidation: Subscription;
    subscriptionUserControllerFicheGetList: Subscription;


    constructor(
        private apiService: APIService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private activeRoute: ActivatedRoute) { }

    ngOnInit()
    {
        this.subscriptionParams = this.activeRoute.params.subscribe(params =>
        {
            this.ResetVariable();
            if (!isNaN(parseFloat(params['idCategorie'])) && !isNaN(parseFloat(params['idFiche'])))
            {
                this.errorServer = false;
                this.subscriptionUserControllerFicheGet =
                    this.apiService.UserController_FicheGet(params['idCategorie'], params['idFiche']).subscribe(
                        (data) =>
                        {
                            this.fiche = data as Fiche;

                            for (var i = 0; i < this.fiche.listeQuestion.length; ++i)
                            {
                                this.disabledCurseur[i] = false;
                                this.colorCurseur[i] = QCMColor.Neutral;
                            }

                            var qcmMode: number = APIService.GetQMCMode();
                            if (qcmMode - 512 >= 0)
                            {
                                this.qcmModeLimitNumberOfQuestion = 6;
                                qcmMode = qcmMode - 512;
                            }
                            if (qcmMode - 256 >= 0)
                            {
                                this.qcmModeLimitNumberOfQuestion = 8;
                                qcmMode = qcmMode - 256;
                            }
                            if (qcmMode - 128 >= 0)
                            {
                                this.qcmModeLimitNumberOfQuestion = 10;
                                qcmMode = qcmMode - 128;
                            }
                            if (qcmMode - 1 >= 0)
                            {
                                this.qcmModeShowErrorOnValidation = true;
                                qcmMode = qcmMode - 128;
                            }

                            if (this.qcmModeLimitNumberOfQuestion != 0)
                                this.fiche.listeQuestion = this.fiche.listeQuestion.slice(0, this.qcmModeLimitNumberOfQuestion);

                            this.isReady = true;
                            this.ref.detectChanges();
                        },
                        error =>
                        {
                            if (error.status == 404)
                                this.router.navigate([`../../`], { relativeTo: this.activeRoute });

                            this.errorServer = true;
                        });
            }
            else
                this.router.navigate([`/eleve/fiche`]);
        });
    }

    ngOnDestroy()
    {
        if (this.subscriptionParams != null)
            this.subscriptionParams.unsubscribe();

        if (this.subscriptionUserControllerFicheGet != null)
            this.subscriptionUserControllerFicheGet.unsubscribe();

        if (this.subscriptionUserControllerFicheValidation != null)
            this.subscriptionUserControllerFicheValidation.unsubscribe();

        if (this.subscriptionUserControllerFicheGetList != null)
            this.subscriptionUserControllerFicheGetList.unsubscribe();
    }

    ResetVariable()
    {
        this.fiche = new Fiche();
        this.colorCurseur = [];
        this.disabledCurseur = [];

        this.isValidationButtonDisable = true;
        this.isReady = false;

        this.reponseList = new Map();
        this.errorNumber = 0;

        this.canValidate = false;
        this.canContinue = false;

        this.isLoading = false;
        this.errorServer = false;

        this.showSuccessModal = false;
        this.showErrorModal = false;
        this.showLoadingModal = false;

        this.qcmModeShowErrorOnValidation = false;
        this.qcmModeLimitNumberOfQuestion = 0;
    }

    IsUsingDots(question: Question)
    {
        if (question.choixDeReponses.length != 0)
            if (question.choixDeReponses[0] == "<p hidden>useDots</p>")
                return true;

        return false;
    }

    OnChangeCurseur(reponseCurseur: number, idCurseur: number)
    {
        //console.log({ i: reponseSlider, j: idReponse });

        this.reponseList.set(idCurseur, reponseCurseur);

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

    Validation()
    {
        this.showLoadingModal = true;
        var reponses: number[] = [];

        for (let i = 1; i <= this.reponseList.size; i++)
        {
            reponses.push(this.reponseList.get(i))
        }

        this.errorServer = false;

        this.subscriptionUserControllerFicheValidation =
            this.apiService.UserController_FicheValidation(
                {
                    idCategorie: this.fiche.idCategorie,
                    idFiche: this.fiche.idFiche,
                    listeReponseEleve: reponses
                }).subscribe(
                    (data: any) =>
                    {
                        this.showLoadingModal = false;
                        if (data != null)
                        {
                            this.errorNumber = data.nombreErreur;

                            if (data.nombreErreur == 0)
                            {
                                this.colorCurseur.forEach(
                                    (value, index) =>
                                    {
                                        this.colorCurseur[index] = QCMColor.Green;
                                    });
                                this.disabledCurseur.forEach(
                                    (value, index) =>
                                    {
                                        this.disabledCurseur[index] = true
                                    });

                                this.canValidate = false;
                                this.showSuccessModal = true;
                                this.canContinue = true;
                            }
                            else
                            {
                                this.showErrorModal = true;
                                data.correction.forEach(
                                    (value, index) =>
                                    {
                                        if (this.qcmModeShowErrorOnValidation)
                                        {
                                            value ?
                                                this.colorCurseur[index] = QCMColor.Green :
                                                this.colorCurseur[index] = QCMColor.Red;
                                            value ?
                                                this.disabledCurseur[index] = true :
                                                this.disabledCurseur[index] = false;
                                        }
                                    });
                            }
                        }
                        else
                            this.errorServer = true;
                    },
                    () =>
                    {
                        this.showLoadingModal = false;
                        this.errorServer = true;
                    });
    }

    Close()
    {
        this.router.navigate([`../../`], { relativeTo: this.activeRoute });
    }

    Continue()
    {
        this.showLoadingModal = true;
        this.subscriptionUserControllerFicheGetList =
            this.apiService.UserController_FicheGetList(0).subscribe(
                (data: any) =>
                {
                    var fiche: FicheDTO[] = [];
                    if (data != null)
                        data.forEach(function (value)
                        {
                            fiche.push(value as FicheDTO);
                        }.bind(this));

                    this.ResetVariable();

                    if (fiche.length > 0)
                        this.router.navigate(['/eleve/qcm', fiche[0].idCategorie, fiche[0].idFiche]);
                    else
                        this.Close();
                },
                () =>
                {
                    this.ResetVariable();
                    this.Close();
                });
    }
}
