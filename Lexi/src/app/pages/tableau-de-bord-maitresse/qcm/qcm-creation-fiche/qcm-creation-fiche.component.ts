import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Fiche } from 'src/app/model/fiche';
import { Question } from 'src/app/model/question';

@Component(
    {
        selector: 'app-qcmcreation-fiche',
        templateUrl: './qcm-creation-fiche.component.html'
    })
export class QCMCreationFicheComponent implements OnInit
{
    isLoading: boolean = false;

    fiche: Fiche = new Fiche();

    errorServer: boolean = false;
    errorInput: boolean = false;

    constructor(
        private apiService: APIService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit()
    {
        this.fiche.listeQuestion = [];
        this.fiche.titre = "Nouvelle Fiche";
        this.fiche.estPublic = 0;
        this.AjouterQuestion();

        this.route.params.subscribe(params =>
        {
            if (!isNaN(parseFloat(params['id'])))
            {
                this.fiche.idCategorie = parseFloat(params['id']);
            }
            else
                this.router.navigate([`../`], { relativeTo: this.route });
        });
    }


    SubmitCreationForm()
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

            this.apiService.AddFiche(this.fiche).subscribe(
                (data: any) =>
                {
                    this.isLoading = false;
                    if (data.code == 200)
                        this.Close();
                    else
                        this.errorServer = true;
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

    Close()
    {
        this.errorServer = false;
        this.router.navigate([`../../`], { relativeTo: this.route });
    }
}
