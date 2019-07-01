import { Question } from './question';

export class Fiche
{
    idFiche: number;
    idCategorie: number;
    titre: string;
    dateCreation: Date;
    estPublic: boolean | number;
    idMaitresseCreatrice: number;

    listeQuestion: Question[];

    prenomCreatrice: string;
    nomCreatrice: string;
}
