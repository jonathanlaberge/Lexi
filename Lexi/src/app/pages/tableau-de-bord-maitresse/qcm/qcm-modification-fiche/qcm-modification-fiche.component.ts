import { Component, OnInit, OnDestroy } from '@angular/core';
import { Fiche } from 'src/app/model/fiche';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Question } from 'src/app/model/question';
import { Subscription } from 'rxjs';

@Component(
    {
        selector: 'app-qcm-modification-fiche',
        templateUrl: './qcm-modification-fiche.component.html'
    })
export class QCMModificationFicheComponent implements OnInit, OnDestroy
{
    isLoading: boolean = false;
    isReady: boolean = false;

    fiche: Fiche = new Fiche();

    errorServer: boolean = false;
    errorInput: boolean = false;

    subscriptionParams: Subscription;
    subscriptionAdminControllerFicheSet: Subscription;
    subscriptionAdminControllerFicheGet: Subscription;

    constructor(
        private apiService: APIService,
        private router: Router,
        private activeRoute: ActivatedRoute) { }

    ngOnInit()
    {
        this.subscriptionParams = this.activeRoute.params.subscribe(params =>
        {
            if (!isNaN(parseFloat(params['idCategorie'])) && !isNaN(parseFloat(params['idFiche'])))
            {
                this.subscriptionAdminControllerFicheGet =
                    this.apiService.AdminController_FicheGet(params['idCategorie'], params['idFiche']).subscribe(
                        (data) =>
                        {
                            this.fiche = data as Fiche;
                            this.isReady = true;
                        },
                        () =>
                        {
                            this.isLoading = false;
                            this.errorServer = true;
                        });
            }
            else
                this.router.navigate([`../`], { relativeTo: this.activeRoute });
        });
    }

    ngOnDestroy()
    {
        if (this.subscriptionParams != null)
            this.subscriptionParams.unsubscribe();

        if (this.subscriptionAdminControllerFicheSet != null)
            this.subscriptionAdminControllerFicheSet.unsubscribe();

        if (this.subscriptionAdminControllerFicheGet != null)
            this.subscriptionAdminControllerFicheGet.unsubscribe();
    }

    SubmitEditForm()
    {
        this.errorInput = false;
        this.errorServer = false;

        if (this.fiche.titre == "")
        {
            this.errorInput = true;
        }
        else
        {
            this.isLoading = true;

            this.subscriptionAdminControllerFicheSet =
                this.apiService.AdminController_FicheSet(this.fiche).subscribe(
                    (data: any) =>
                    {
                        this.isLoading = false;
                        if (data.code == 200)
                            this.Close();
                        else
                        {
                            this.errorServer = true;
                        }
                    },
                    () =>
                    {
                        this.isLoading = false;
                        this.errorServer = true;
                    });
        }
    }

    AjouterQuestion()
    {
        var question = new Question();
        question.idCategorie = this.fiche.idCategorie;
        question.idFiche = this.fiche.idFiche;
        question.idQuestion = this.fiche.listeQuestion.length + 1;
        question.question = "<p></p>";
        question.choixDeReponses = ["<p>Vrai</p>", "<p>Faux</p>"];
        question.bonneReponse = 1;
        this.fiche.listeQuestion.push(question);
    }

    EnleverQuestion()
    {
        this.fiche.listeQuestion.pop();
    }

    AjouterReponse(index: number)
    {
        this.fiche.listeQuestion[index].choixDeReponses.push("");
    }

    EnleverReponse(index: number)
    {
        this.fiche.listeQuestion[index].choixDeReponses.pop();
    }

    OnChangeUserDots(index: number, event)
    {
        if (event.target.checked)
        {
            this.fiche.listeQuestion[index].choixDeReponses = ["<p hidden>useDots</p>"];
        }
        else
        {
            this.fiche.listeQuestion[index].choixDeReponses = ["<p>Vrai</p>", "<p>Faux</p>"];
            this.fiche.listeQuestion[index].bonneReponse = 1;
        }
    }

    IsUsingDots(question: Question)
    {
        if (question.choixDeReponses.length != 0)
            if (question.choixDeReponses[0] == "<p hidden>useDots</p>")
                return true;

        return false;
    }

    Close()
    {
        this.errorServer = false;
        this.router.navigate([`../../`], { relativeTo: this.activeRoute });
    }

    TrackByIndex(index: number, obj: any): any
    {
        return index;
    }
}
