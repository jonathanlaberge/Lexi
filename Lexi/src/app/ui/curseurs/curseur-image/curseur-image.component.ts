import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import { DomSanitizer } from '@angular/platform-browser';
import { QCMColor } from 'src/app/model/qcm-color.enum';



@Component({
  selector: 'curseur-image',
  templateUrl: './curseur-image.component.html',
  styleUrls: ['./curseur-image.component.css']
})
export class CurseurImageComponent implements OnInit {



    @Input()
    curseurID: number = 1; //TODO: Cannot change after view init.

    @Input()
    answerMax: number = 3; //TODO: Cannot change after view init.

    @Input()
    useDots: boolean = false;

    @Input()
    question: string = null;

    @Input()
    answers: string[] = []; //TODO: Cannot change after view init.

    @Output()
    valueChanged = new EventEmitter<number>();

    @Input()
    set color(color: QCMColor) {
        switch (color) {
            case QCMColor.Green:
                $("#picker" + this.curseurID).css("background-color", "green");
                $("#pickerNumber" + this.curseurID).css("border-color", "green");
                $("#pickerNumber" + this.curseurID).css("color", "green");
                break;

            case QCMColor.Red:
                $("#picker" + this.curseurID).css("background-color", "red");
                $("#pickerNumber" + this.curseurID).css("border-color", "red");
                $("#pickerNumber" + this.curseurID).css("color", "red");
                break;

            default:
                $("#picker" + this.curseurID).css("background-color", "#E2F700");
                $("#pickerNumber" + this.curseurID).css("border-color", "Black");
                $("#pickerNumber" + this.curseurID).css("color", "black");
                break;
        }
    }

    @Input()
    set disable(isDisabled: boolean) {
        switch (isDisabled) {
            case true:
                $("#picker" + this.curseurID).slider("disable");
                break;

            default:
                $("#picker" + this.curseurID).slider("enable");
                break;
        }
    }







    onClick(w: number, q: number){

        console.log(w,(q +1));

    }



  constructor() { }

    ngOnInit() {

        if (this.useDots) {



        }


  }

}
