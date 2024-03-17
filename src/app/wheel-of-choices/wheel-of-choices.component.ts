import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-wheel-of-choices',
  standalone: true,
  imports: [],
  templateUrl: './wheel-of-choices.component.html',
  styleUrl: './wheel-of-choices.component.scss'
})
export class WheelOfChoicesComponent implements AfterViewInit {
  wheel!: HTMLDivElement;
  spinButton!: HTMLDivElement;
  choicesTextArea!: HTMLTextAreaElement;
  wheelRotationAngle: number = 0;

  ngAfterViewInit(): void {
    this.wheel = document.querySelector(".wheel") as HTMLDivElement;
    this.spinButton = document.querySelector('.spin-button') as HTMLDivElement;
    this.choicesTextArea = document.querySelector('.choicesTextArea') as HTMLTextAreaElement;
    this.choicesTextArea.value = 'Pizza\nAsia\nIndian';
    this.initWheelParts(this.choicesTextArea.value.replace('\r', '\n').replace('\n+', '\n').split('\n'));
  }

  handleOnChoicesTaInputEvent(taText: string) {
    console.log('wheel: onChoicesTaInputEvent=' + taText);
    this.wheel.innerHTML = ''; // removes all child nodes of the wheel
    let choices: string[] = this.choicesTextArea.value.replace('\r', '\n').replace('\n+', '\n').split('\n');
    this.initWheelParts(choices);
  }

  handleOnSpinBtnClickEvent() {
    console.log('wheel: handleOnSpinBtnClickEvent');
    this.wheelRotationAngle += (1000 + Math.ceil(Math.random() * 4000));
    this.wheel.style.transform = "rotate(" + this.wheelRotationAngle + "deg)";
  }


  private getRandomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red},${green},${blue})`;
  }

  private createClipPathValue(
    wheelWidthPx: number,
    wheelSectionWidthPx: number): string {

    const diffOfWheelAndSectionPx: number = (wheelWidthPx - wheelSectionWidthPx);

    const wheelSectionWidthPercent: number = 100 / wheelWidthPx * wheelSectionWidthPx;
    const wheelSectionLeftMarginPercent: number = 100 / wheelWidthPx * (diffOfWheelAndSectionPx / 2);

    return "polygon("
      + wheelSectionLeftMarginPercent + "% 0,"
      + (wheelSectionLeftMarginPercent + wheelSectionWidthPercent + 1) + "% 0," /* "+1" for fixing space between */
      + "50% 100%)";
  }

  private initWheelParts(choices: string[]): void {
    let wheelDiv: HTMLDivElement = document.querySelector('.wheel') as HTMLDivElement;

    if (choices.length == 1) {
      this.createSectionsForOneSection(wheelDiv, choices[0]);
    }
    if (choices.length == 2) {
      this.createSectionsForTwoSections(wheelDiv, choices[0], choices[1]);
    }
    if (choices.length == 3) {
      this.createSectionsForThreeSections(wheelDiv, choices[0], choices[1], choices[2]);
    }
    if (choices.length >= 4) {
      this.createSectionsForFourAndMoreSections(wheelDiv, choices);
    }
    let wheelSectionsDivs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.wheel div');
    wheelSectionsDivs.forEach(element => {
      element.style.background = this.getRandomColor();
    });
  }

  private createSectionsForOneSection(
    wheelDiv: HTMLDivElement,
    sectionText1: string) {

    let section: HTMLDivElement = document.createElement('div');
    section.classList.add('wheel-section');
    section.style.height = '100%';
    section.innerHTML = sectionText1;
    wheelDiv.appendChild(section);
  }

  private createSectionsForTwoSections(
    wheelDiv: HTMLDivElement,
    sectionText1: string,
    sectionText2: string) {

    let section1: HTMLDivElement = document.createElement('div');
    section1.classList.add('wheel-section');
    section1.innerHTML = sectionText1;
    section1.style.background = this.getRandomColor();
    wheelDiv.appendChild(section1);

    let section2: HTMLDivElement = document.createElement('div');
    section2.classList.add('wheel-section');
    section2.innerHTML = sectionText2;
    section2.style.transform = "rotate(180deg)";
    wheelDiv.appendChild(section2);
  }

  private createSectionsForThreeSections(
    wheelDiv: HTMLDivElement,
    sectionText1: string,
    sectionText2: string,
    sectionText3: string) {

    let section1: HTMLDivElement = document.createElement('div');
    section1.classList.add('wheel-section');
    section1.innerHTML = sectionText1;
    section1.style.clipPath = 'polygon(0 0, 100% 0, 100% 73.5%, 50% 100%)'
    wheelDiv.appendChild(section1);

    let section2: HTMLDivElement = document.createElement('div');
    section2.classList.add('wheel-section');
    section2.innerHTML = sectionText2;
    section2.style.clipPath = 'polygon(0 0, 100% 0, 100% 73.5%, 50% 100%)'
    section2.style.transform = "rotate(120deg)";
    wheelDiv.appendChild(section2);

    let section3: HTMLDivElement = document.createElement('div');
    section3.classList.add('wheel-section');
    section3.innerHTML = sectionText3;
    section3.style.clipPath = 'polygon(0 0, 100% 0, 100% 73.5%, 50% 100%)'
    section3.style.transform = "rotate(240deg)";
    wheelDiv.appendChild(section3);
  }

  /**
   *     a
   * ___________________
   * \C°   90°|        /
   *  \       |
   *   \      |
   *    \     |
   *   b \    | c
   *      \   |
   *       \A°|
   *        \ |
   *         \|/
   *
   * a/sin(A°) = c/sin(C°)
   * a = c/sin(C°)*sin(A°)
   *
   */
  private createSectionsForFourAndMoreSections(
    wheelDiv: HTMLDivElement,
    choices: string[]) {

    // calculate variables
    const ADeg: number = (360 / choices.length) / 2;
    const CDeg: number = 180 - 90 - ADeg;
    const c: number = wheelDiv.clientHeight / 2;
    const ADegRad: number = (ADeg * Math.PI) / 180; // Umwandlung in Radians, weil Math-Funktionen als Winkel den Radians erwarten
    const CDegRad: number = (CDeg * Math.PI) / 180; // Umwandlung in Radians, weil Math-Funktionen als Winkel den Radians erwarten
    const a: number = c / Math.sin(CDegRad) * Math.sin(ADegRad);

    // create the clip-path-value
    const wheelWidthPx: number = wheelDiv.clientWidth;
    const wheelSectionWidthPx: number = a * 2;
    let clipPathValue: string = this.createClipPathValue(wheelWidthPx, wheelSectionWidthPx);

    // create the wheel sections
    for (let i = 0; i < choices.length; i++) {
      let section: HTMLDivElement = document.createElement('div');
      section.classList.add('wheel-section');
      section.style.clipPath = clipPathValue;
      section.style.transform = "rotate(" + (i * ADeg * 2) + "deg)";
      section.innerHTML = choices[i];
      wheelDiv.appendChild(section);
    }
  }

}
