import GSAP from 'gsap';
import { each } from 'lodash';
import Component from '../classes/Component';
import { split } from '../utils/split-text';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
        images: document.querySelectorAll('img'),
      },
    });
    // split the text so we can animate it
    split({
      element: this.elements.title,
      expression: '<br>',
    });
    // for some reason we do it again, maybe to add some overflow animation styles??
    split({
      element: this.elements.title,
      expression: '<br>',
    });
    // set the titleSpans element
    this.elements.titleSpans = this.elements.title.querySelectorAll("span span")
    // the number of assets we have loaded
    this.length = 0;
    // run the preloader
    this.createLoader();
  }

  createLoader() {
    each(this.elements.images, (element) => {
      // when an image has loaded, call the onAssetLoaded
      element.onload = () => this.onAssetLoaded(element);
      // then we can switch out the data-src with the src
      element.src = element.getAttribute('data-src');
    });
  }

  onAssetLoaded(image) {
    // add one to the length
    this.length += 1;
    // get the current percent of images loaded
    const percent = this.length / this.elements.images.length;
    // alter the number shown in the DOM
    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;
    // if the percent equals 1 everything is loaded and we can call this.onLoaded()
    if (percent === 1) {
      this.onLoaded();
    }
  }

  // run this when all of the images have loaded
  onLoaded() {
    return new Promise((resolve) => {
      // set up a GSAP timeline
      this.animateOut = GSAP.timeline({
        delay: 1,
      });
      // animate the title out
      this.animateOut.to(this.elements.titleSpans, {
          duration: 1.5,
          ease: "expo.out",
          stagger: 0.1,
          y: "100%"
      })
      // animate the numbers out
      this.animateOut.to(
        this.elements.numberText,
        {
          duration: 1.5,
          ease: 'expo.out',
          stagger: 0.1,
          y: '100%',
        },
        '-=1.4'
      );

      // animate the whole preloader element out
      this.animateOut.to(this.element, {
        duration: 1.5,
        ease: 'expo.out',
        scaleY: 0,
        transformOrigin: '100% 100%',
      }, "-=1");
      // emit completed when the preloader has animated out
      // we can listen to this and run some code
      // e.g fade in/animate some content
      this.animateOut.call(() => {
        this.emit('completed');
      });
    });
  }

  destroy() {
    // remove the preloader element
    this.element.parentNode.removeChild(this.element);
  }
}
