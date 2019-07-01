export class Question
{
    idQuestion: number;
    idFiche: number;
    idCategorie: number;
    question: string;
    choixDeReponses: string[];
    bonneReponse: number;

    public IsUsingDots(): boolean
    {
        if (this.choixDeReponses.length != 0)
            if (this.choixDeReponses[0] == "<p hidden>useDots</p>")
                return true;

        return false;
    }
}
