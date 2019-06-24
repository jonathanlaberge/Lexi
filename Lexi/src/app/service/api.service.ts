import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Maitresse } from '../model/maitresse';
import { Eleve } from '../model/eleve';

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
    
    public GetEleveList()
    {
        this.SetHeader();
        return this.httpClient.get(`${API_URL}admin/user/liste`, this.options);
    }


    public EditEleve(eleve: Eleve) {

        this.SetHeader();
        return this.httpClient.post(`${API_URL}admin/user/${eleve.idEleve}`, JSON.stringify(eleve), this.options);


    }










}
