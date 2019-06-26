import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Maitresse } from '../model/maitresse';
import { Eleve } from '../model/eleve';
import { Categorie } from '../model/categorie';
import { Fiche } from '../model/fiche';

export const API_URL = "http://lexi.jolab.me/v1/";

@Injectable(
    {
        providedIn: 'root'
    })
export class APIService
{

    



    private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    public static currentMaitresse: Maitresse = null;
    public static currentEleve: Eleve = null;

    public static token: string = null;
    public static tokenExpired: boolean = false;

    private static jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private httpClient: HttpClient) { }

    private SetHeader()
    {
        console.log("Token: " + APIService.token);

        if (APIService.token != null)
            this.options =
                {
                    headers: new HttpHeaders().set('Content-Type', 'application/json')
                        .append('Authorization', `Bearer ${APIService.token}`)
                };
        else
            this.options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    }

    public static IsTokenExpired(): boolean
    {
        var expired = APIService.jwtHelper.isTokenExpired(APIService.token);
        APIService.tokenExpired = expired;
        return expired;
    }

    public static IsTokenInAdminMode(): boolean
    {
        return (APIService.jwtHelper.decodeToken(APIService.token).mode == "admin");
    }

    public static IsTokenInEleveMode(): boolean
    {
        return (APIService.jwtHelper.decodeToken(APIService.token).mode == "user" &&
            APIService.jwtHelper.decodeToken(APIService.token).idEleveEnCours > 0);
    }

    public Connection(maitresse: Maitresse)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}compte/connection`, JSON.stringify(maitresse), this.options);
    }

    public Enregistrement(maitresse: Maitresse)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}compte/enregistrement`, JSON.stringify(maitresse), this.options);
    }

    public Mode(obj: any)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}compte/mode`, JSON.stringify(obj), this.options);
    }

    // ELEVES// ELEVES// ELEVES// ELEVES// ELEVES// ELEVES// ELEVES// ELEVES// ELEVES// ELEVES// ELEVES
    public GetEleveList()
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/user/liste`, this.options);
    }


    public EditEleve(eleve: Eleve) {

        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/user/${eleve.idEleve}`, JSON.stringify(eleve), this.options);


    }


    AddEleve(eleve: Eleve) {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/user/creation`, JSON.stringify(eleve), this.options);

    }



    DeleteEleve(idEleve: number) {
        this.SetHeader();
        return this.httpClient.delete(`${API_URL}admin/user/${idEleve}`, this.options);
    }



    /// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES/// CATEGORIES



    public GetCategorieList() {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/categorie/liste`, this.options);
    }


    EditCategorie(categorie: Categorie) {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/categorie/${categorie.idCategorie}`, JSON.stringify(categorie), this.options);
    }


    DeleteCategorie(idCategorie: number) {
        this.SetHeader();
        return this.httpClient.delete(`${API_URL}admin/categorie/${idCategorie}`, this.options);
    }

    GetFicheList(page: number,idCategorie: number) {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/fiches/liste/${page}/parcategorie/${idCategorie}`, this.options);
    }




    AddCategorie(categorie: Categorie) {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/categorie/creation`, JSON.stringify(categorie), this.options);

    }
/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayList/// PlayLis /// PlayList/// PlayList/// PlayList/// PlayList



    GetPlaylist() {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}eleve/fiches/liste`, this.options);

    }



    Postvalidation(fiche : Fiche) {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}eleve/fiches/validation`, this.options);

    }









}
