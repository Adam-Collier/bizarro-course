import Animation from '../classes/Animation';
import GSAP from 'gsap';

// an animation to scale in an element
export default class Highlight extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
  }

  animateIn() {
    // we add a delay here so it animated in further up the screen
    this.timelineIn = GSAP.timeline({
      delay: 0.5,
    });

    // fade in ans scale down the element
    this.timeline.fromTo(this.element, {
        autoAlpha: 0,
        scale: 1.2
    },{
        autoAlpha: 1,
        duration: 1.5,
        ease: "expo.out",
        scale: 1
    })
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {

  }
}
