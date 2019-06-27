import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import { DomSanitizer } from '@angular/platform-browser';
import { QCMColor } from 'src/app/model/qcm-color.enum';

@Component(
    {
        selector: 'curseur-simple',
        templateUrl: './curseur-simple.component.html',
        styleUrls: ['./curseur-simple.component.css']
    })
export class CurseurSimpleComponent implements OnInit, OnDestroy, AfterViewInit
{
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
    set disable(isDisabled: boolean)
    {
        switch (isDisabled)
        {
            case true:
                $("#picker" + this.curseurID).slider("disable");
                break;

            default:
                $("#picker" + this.curseurID).slider("enable");
                break;
        }
    }

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit()
    {
        this.valueChanged.emit(0);
        if (this.answers.length != 0)
        {
            this.useDots = false;

            if (this.answerMax != this.answers.length)
                this.answerMax = this.answers.length;
        }
    }

    ngAfterViewInit()
    {

        $("#picker" + this.curseurID).slider(
            {
                range: "max",
                min: 0,
                max: this.answerMax,
                create: function ()
                {
                    if (this.useDots)
                        $("#pickerNumber" + this.curseurID).text(" ");
                    else
                        $("#pickerNumber" + this.curseurID).text(0);
                }.bind(this),
                slide: function (event, ui) 
                {
                    if (this.useDots)
                        $("#pickerNumber" + this.curseurID).text(Array(ui.value + 1).join("●"));
                    else
                        $("#pickerNumber" + this.curseurID).text(ui.value);

                    this.valueChanged.emit(ui.value);
                }.bind(this)
            });



        switch (this.color) {
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

    ngOnDestroy()
    {
        $("picker" + this.curseurID).slider("destroy");
    }
}
