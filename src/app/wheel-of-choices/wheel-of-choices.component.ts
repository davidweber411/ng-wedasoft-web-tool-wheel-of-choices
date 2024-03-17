import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-wheel-of-choices',
  standalone: true,
  imports: [],
  templateUrl: './wheel-of-choices.component.html',
  styleUrl: './wheel-of-choices.component.scss'
})
export class WheelOfChoicesComponent implements AfterViewInit {
  wheelDiv!: HTMLDivElement;
  spinButton!: HTMLDivElement;
  choicesTextArea!: HTMLTextAreaElement;
  wheelRotationAngle: number = 0;

  ngAfterViewInit(): void {
    this.wheelDiv = document.querySelector(".wheel") as HTMLDivElement;
    this.spinButton = document.querySelector('.spin-button') as HTMLDivElement;
    this.choicesTextArea = document.querySelector('.choicesTextArea') as HTMLTextAreaElement;
    this.choicesTextArea.value = 'Pizza\nAsia\nIndian';
    this.initWheelParts(this.choicesTextArea.value.replace('\r', '\n').replace('\n+', '\n').split('\n'));
  }

  handleOnChoicesTaInputEvent(taText: string) {
    console.log('wheel: onChoicesTaInputEvent=' + taText);
    this.wheelDiv.innerHTML = ''; // removes all child nodes of the wheel
    let choices: string[] = this.choicesTextArea.value.replace('\r', '\n').replace('\n+', '\n').split('\n');
    this.initWheelParts(choices);
  }

  handleOnSpinBtnClickEvent() {
    console.log('wheel: handleOnSpinBtnClickEvent');
    this.wheelRotationAngle += (1000 + Math.ceil(Math.random() * 4000));
    this.wheelDiv.style.transform = "rotate(" + this.wheelRotationAngle + "deg)";
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
    if (choices.length == 1) {
      this.createSectionsForOneSection(choices[0]);
    }
    if (choices.length == 2) {
      this.createSectionsForTwoSections(choices[0], choices[1]);
    }
    if (choices.length == 3) {
      this.createSectionsForThreeSections(choices[0], choices[1], choices[2]);
    }
    if (choices.length >= 4) {
      this.createSectionsForFourAndMoreSections(choices);
    }
    let wheelSectionsDivs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.wheel div');
    wheelSectionsDivs.forEach(element => {
      element.style.background = this.getRandomColor();
    });
  }

  private createSectionsForOneSection(sectionText1: string) {
    let section: HTMLDivElement = this.createWheelSectionDiv(sectionText1);
    section.style.height = '100%';
    this.wheelDiv.appendChild(section);
  }

  private createWheelSectionDiv(text: string) {
    let section: HTMLDivElement = document.createElement('div');
    section.classList.add('wheel-section');
    section.innerHTML = text;

    return section;
  }


  private createSectionsForTwoSections(
    sectionText1: string,
    sectionText2: string) {

    let section1: HTMLDivElement = document.createElement('div');
    section1.classList.add('wheel-section');
    section1.innerHTML = sectionText1;
    section1.style.background = this.getRandomColor();
    this.wheelDiv.appendChild(section1);

    let section2: HTMLDivElement = document.createElement('div');
    section2.classList.add('wheel-section');
    section2.innerHTML = sectionText2;
    section2.style.transform = "rotate(180deg)";
    this.wheelDiv.appendChild(section2);
  }

  private createSectionsForThreeSections(
    sectionText1: string,
    sectionText2: string,
    sectionText3: string) {

    let section1: HTMLDivElement = document.createElement('div');
    section1.classList.add('wheel-section');
    section1.innerHTML = sectionText1;
    section1.style.clipPath = 'polygon(0 0, 100% 0, 100% 73.5%, 50% 100%)'
    this.wheelDiv.appendChild(section1);

    let section2: HTMLDivElement = document.createElement('div');
    section2.classList.add('wheel-section');
    section2.innerHTML = sectionText2;
    section2.style.clipPath = 'polygon(0 0, 100% 0, 100% 73.5%, 50% 100%)'
    section2.style.transform = "rotate(120deg)";
    this.wheelDiv.appendChild(section2);

    let section3: HTMLDivElement = document.createElement('div');
    section3.classList.add('wheel-section');
    section3.innerHTML = sectionText3;
    section3.style.clipPath = 'polygon(0 0, 100% 0, 100% 73.5%, 50% 100%)'
    section3.style.transform = "rotate(240deg)";
    this.wheelDiv.appendChild(section3);
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
  private createSectionsForFourAndMoreSections(choices: string[]) {
    // calculate variables
    const ADeg: number = (360 / choices.length) / 2;
    const CDeg: number = 180 - 90 - ADeg;
    const c: number = this.wheelDiv.clientHeight / 2;
    const ADegRad: number = (ADeg * Math.PI) / 180; // Umwandlung in Radians, weil Math-Funktionen als Winkel den Radians erwarten
    const CDegRad: number = (CDeg * Math.PI) / 180; // Umwandlung in Radians, weil Math-Funktionen als Winkel den Radians erwarten
    const a: number = c / Math.sin(CDegRad) * Math.sin(ADegRad);

    // create the clip-path-value
    const wheelWidthPx: number = this.wheelDiv.clientWidth;
    const wheelSectionWidthPx: number = a * 2;
    let clipPathValue: string = this.createClipPathValue(wheelWidthPx, wheelSectionWidthPx);

    // create the wheel sections
    for (let i = 0; i < choices.length; i++) {
      let section: HTMLDivElement = document.createElement('div');
      section.classList.add('wheel-section');
      section.style.clipPath = clipPathValue;
      section.style.transform = "rotate(" + (i * ADeg * 2) + "deg)";
      section.innerHTML = choices[i];
      this.wheelDiv.appendChild(section);
    }
  }

}
