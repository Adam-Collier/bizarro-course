import Animation from '../classes/Animation';
import GSAP from 'gsap';
import { calculate, split } from '../utils/split-text';
import { each } from 'lodash';

export default class Label extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });

    // split the text so we can animate it
    split({
      element: this.element,
      append: true,
    });

    split({
      element: this.element,
      append: true,
    });

    // grab the spans
    this.elementLinesSpans = this.element.querySelectorAll('span span');
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({
      delay: 0.5,
    });

    this.timelineIn.set(this.element, {
      autoAlpha: 1,
    });

    // animate in each line
    each(this.elementsLines, (line, index) => {
      this.timelineIn.fromTo(
        line,
        {
          y: '100%',
        },
        {
          delay: index * 0.2,
          duration: 1.5,
          ease: 'expo.out',
          y: '0%',
        },
        0
      );
    });
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {
    this.elementsLines = calculate(this.elementLinesSpans);
  }
}
