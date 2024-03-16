import { Component } from '@angular/core';
import {WheelOfChoicesComponent} from "../wheel-of-choices/wheel-of-choices.component";
import {ConfigFormComponent} from "../config-form/config-form.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    WheelOfChoicesComponent,
    ConfigFormComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
