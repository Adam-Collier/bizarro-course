import Animation from '../classes/Animation';
import GSAP from 'gsap';
import { calculate, split } from '../utils/split-text';
import { each } from 'lodash';

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });

    // split the text so we can animate it
    this.elementLinesSpans = split({
      element: this.element,
      append: true,
    });
  }

  animateIn() {
    // delay the animation so it happens in the centre of the viewport
    this.timelineIn = GSAP.timeline({
      delay: 0.5,
    });

    this.timelineIn.set(this.element, {
      autoAlpha: 1,
    });

    // animate each line in and up
    each(this.elementsLines, (line, index) => {
      this.timelineIn.fromTo(
        line,
        {
          autoAlpha: 0,
          y: '100%',
        },
        {
          autoAlpha: 1,
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
