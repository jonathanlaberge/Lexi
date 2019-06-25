import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import { DomSanitizer } from '@angular/platform-browser';

@Component(
    {
        selector: 'curseur-simple',
        templateUrl: './curseur-simple.component.html',
        styleUrls: ['./curseur-simple.component.css']
    })
export class CurseurSimpleComponent implements OnInit, OnDestroy, AfterViewInit
{
    @Input()
    curseurID: number = 1;

    @Input()
    answerMax: number = 3;

    @Input()
    useDots: boolean = false;

    @Input()
    question: string = null;

    @Input()
    answers: string[] = [];

    @Output()
    valueChanged = new EventEmitter<number>();

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
                        $("#pickerNumber" + this.curseurID).text("●");
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

    }

    ngOnDestroy()
    {
        $("picker" + this.curseurID).slider("destroy");
    }
}
