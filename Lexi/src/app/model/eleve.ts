export class Eleve
{
    idEleve: number;
    prenom: string;
    nom: string;
    dateNaissance: Date;
    genre: number;
    avatar: string;

    constructor(
        id: number = null,
        prenom: string = null,
        nom: string = null,
        dateNaissance: Date = new Date(),
        genre: number = null,
        avatar: string = null)
    {
        this.idEleve = id;
        this.prenom = prenom
        this.nom = nom
        this.dateNaissance = dateNaissance;
        this.genre = genre;
        this.avatar = avatar;

    }
}
