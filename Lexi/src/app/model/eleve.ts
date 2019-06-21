export class Eleve {

    idEleve: number;
    prenom: string;
    nom: string;
    dateNaissance: Date;
    genre: number;
    avatar: string;





    constructor(id: number, prenom: string, nom: string, genre: number, avatar: string) {

        this.idEleve = id;
        this.prenom = prenom
        this.nom = nom
        this.dateNaissance = new Date();
        this.genre = genre;
        this.avatar = avatar;

    }





}
