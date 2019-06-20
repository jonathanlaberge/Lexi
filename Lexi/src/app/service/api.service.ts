import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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


    constructor(private httpClient: HttpClient)
    {

    }

    private RefreshHeader()
    {
        if (APIService.token != null)
            this.options =
                {
                    headers: new HttpHeaders().set('Content-Type', 'application/json')
                        .append('Authorization', `Bearer ${APIService.token}`)
                        .append('Access-Control-Allow-Origin', '*')
                };
        else
            this.options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    }



    public Connection(maitresse: Maitresse)
    {
        this.RefreshHeader();
        return this.httpClient.post(`${API_URL}compte/connection`, JSON.stringify(maitresse), this.options);
    }
}