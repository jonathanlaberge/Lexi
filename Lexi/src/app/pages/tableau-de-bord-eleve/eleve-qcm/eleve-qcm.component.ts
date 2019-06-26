import { Component, OnInit } from '@angular/core';
import { QCMColor } from 'src/app/model/qcm-color.enum';

@Component(
    {
        selector: 'app-eleve-qcm',
        templateUrl: './eleve-qcm.component.html',
        styleUrls: ['./eleve-qcm.component.css']
    })
export class EleveQCMComponent implements OnInit
{
    answers = ["sdtdsff", "dsfsdfsdfsf", "dsfsdfsdfsf", "dsfsdfsdfsf"];
    testcolor = QCMColor.Green;
    constructor() { }

    ngOnInit()
    {
    }
    test(i: number, j: number)
    {
        console.log({ i: i, j: j });
    }

}
