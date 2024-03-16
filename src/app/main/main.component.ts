import { Component } from '@angular/core';
import {WheelOfChoicesComponent} from "../wheel-of-choices/wheel-of-choices.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    WheelOfChoicesComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
