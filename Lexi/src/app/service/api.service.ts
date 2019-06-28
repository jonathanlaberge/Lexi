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


    // Admin - Eleve
    public GetEleveList(page: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/eleve/liste/${page}`, this.options);
    }
    
    public EditEleve(eleve: Eleve)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/eleve/${eleve.idEleve}`, JSON.stringify(eleve), this.options);
    }
    
    public AddEleve(eleve: Eleve)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/eleve/creation`, JSON.stringify(eleve), this.options);
    }

    public DeleteEleve(idEleve: number)
    {
        this.SetHeader();
        return this.httpClient.delete(`${API_URL}admin/eleve/${idEleve}`, this.options);
    }
    

    /// Admin - Categorie
    public GetCategorieList(page: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/categorie/liste/${page}`, this.options);
    }
    
    public GetCategorie(idCategorie: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/categorie/${idCategorie}`, this.options);
    }

    public EditCategorie(categorie: Categorie)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/categorie/${categorie.idCategorie}`, JSON.stringify(categorie), this.options);
    }
    
    public DeleteCategorie(idCategorie: number)
    {
        this.SetHeader();
        return this.httpClient.delete(`${API_URL}admin/categorie/${idCategorie}`, this.options);
    }

    public AddCategorie(categorie: Categorie)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/categorie/creation`, JSON.stringify(categorie), this.options);
    }

    /// Admin - Fiche
    public GetFicheList(page: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/fiches/liste/${page}`, this.options);
    }

    public GetFicheListCategorie(page: number, idCategorie: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/fiches/liste/${page}/parcategorie/${idCategorie}`, this.options);
    }

    //Eleve - Fiche
    public GetPlaylist(page: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}eleve/fiches/liste/${page}`, this.options);
    }

    public FicheValidation(validation: any)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}eleve/fiches/validation`, JSON.stringify(validation), this.options);
    }
    
    public GetFicheQuestion(idCategorie: number, idFiche: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}eleve/fiches/${idCategorie}/${idFiche}`, this.options);
    }


    //Playlist - Playlist //UserSetTODOList

    AddPlayliste(selectedFicheListDTO: any[]) {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/eleve/${selectedFicheListDTO[0].idEleve}/listeafaire`, JSON.stringify(selectedFicheListDTO), this.options);
    }

}
