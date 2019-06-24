import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';

@Component(
    {
        selector: 'curseur-simple',
        templateUrl: './curseur-simple.component.html',
        styleUrls: ['./curseur-simple.component.css']
    })
export class CurseurSimpleComponent implements OnInit
{

    constructor() { }

    ngOnInit()
    {
        $("#picker1").slider(
            {
                range: "max",
                min: 0,
                max: 3,
                create: function ()
                {
                    $("#pickerNumber1").text($(this).slider("value"));
                    //reponsesNumber.set("picker1", $(this).slider("value"));
                },
                slide: function (event, ui) 
                {
                    $("#pickerNumber1").text(ui.value);
                    //reponsesNumber.set("picker1", ui.value);
                    //CheckAllSlider();
                }
            });
    }

}
