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

    public static token: string = null;
    public static tokenExpired: boolean = false;

    private static jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private httpClient: HttpClient) { }

    private SetHeader()
    {
        //console.log("Token: " + APIService.token);

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

    public static GetQMCMode(): number
    {
        return APIService.jwtHelper.decodeToken(APIService.token).qcmMode;
    }


    public AccountController_Connection(maitresse: Maitresse)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}compte/connection`, JSON.stringify(maitresse), this.options);
    }

    public AccountController_Enregistrement(maitresse: Maitresse)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}compte/enregistrement`, JSON.stringify(maitresse), this.options);
    }

    public AccountController_Mode(obj: any)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}compte/mode`, JSON.stringify(obj), this.options);
    }
    
    public AccountController_ProfilUpdate(maitresse: Maitresse)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}compte/profil`, JSON.stringify(maitresse), this.options);
    }



    // Admin - Eleve
    public AdminController_UserGetList(page: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/eleve/liste/${page}`, this.options);
    }

    public AdminController_UserSet(eleve: Eleve)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/eleve/${eleve.idEleve}`, JSON.stringify(eleve), this.options);
    }

    public AdminController_UserGet(idEleve: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/eleve/${idEleve}`, this.options);
    }

    public AdminController_UserCreation(eleve: Eleve)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/eleve/creation`, JSON.stringify(eleve), this.options);
    }

    public AdminController_UserDelete(idEleve: number)
    {
        this.SetHeader();
        return this.httpClient.delete(`${API_URL}admin/eleve/${idEleve}`, this.options);
    }

    public AdminController_UserSetTODOList(selectedFicheList: any[], idEleve: number)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/eleve/${idEleve}/listeafaire`, JSON.stringify(selectedFicheList), this.options);
    }

    public AdminController_UserGetTODOList(id: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/eleve/${id}/listeafaire`, this.options);
    }


    /// Admin - Categorie
    public AdminController_CategorieGetList(page: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/categorie/liste/${page}`, this.options);
    }

    public AdminController_CategorieGet(idCategorie: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/categorie/${idCategorie}`, this.options);
    }

    public AdminController_CategorieSet(categorie: Categorie)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/categorie/${categorie.idCategorie}`, JSON.stringify(categorie), this.options);
    }

    public AdminController_CategorieDelete(idCategorie: number)
    {
        this.SetHeader();
        return this.httpClient.delete(`${API_URL}admin/categorie/${idCategorie}`, this.options);
    }

    public AdminController_CategorieCreation(categorie: Categorie)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/categorie/creation`, JSON.stringify(categorie), this.options);
    }


    /// Admin - Fiche
    public AdminController_FicheGetList(page: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/fiches/liste/${page}`, this.options);
    }

    public AdminController_FicheGetListCategorie(page: number, idCategorie: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/fiches/liste/${page}/parcategorie/${idCategorie}`, this.options);
    }

    public AdminController_FicheCreation(fiche: Fiche)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/fiches/creation`, JSON.stringify(fiche), this.options);
    }

    public AdminController_FicheDelete(idCategorie: number, idFiche: number)
    {
        this.SetHeader();
        return this.httpClient.delete(`${API_URL}admin/fiches/${idCategorie}/${idFiche}`, this.options);
    }

    public AdminController_FicheGet(idCategorie: number, idFiche: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/fiches/${idCategorie}/${idFiche}`, this.options);
    }

    public AdminController_FicheSet(fiche: Fiche)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/fiches/${fiche.idCategorie}/${fiche.idFiche}`, JSON.stringify(fiche), this.options);
    }

    // Eleve
    public UserController_FicheGetList(page: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}eleve/fiches/liste/${page}`, this.options);
    }

    public UserController_FicheValidation(validation: any)
    {
        this.SetHeader();
        return this.httpClient.post(`${API_URL}eleve/fiches/validation`, JSON.stringify(validation), this.options);
    }

    public UserController_FicheGet(idCategorie: number, idFiche: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}eleve/fiches/${idCategorie}/${idFiche}`, this.options);
    }
 
    public UserController_Historique(page: number)
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}eleve/fiches/historique/${page}`, this.options);
    }
}
