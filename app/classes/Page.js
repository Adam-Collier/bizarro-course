import GSAP from 'gsap';

// This will be a class we can reuse for all of the pages
export default class Page {
  // on initialisation we will grab the main page element (this.selector), whatever elements we need (this.selectorChildren) and the page id
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = { ...elements };
    this.id = id;

    // store everything we need for the scroll here
    this.scroll = {
      // the current value
      current: 0,
      // where we have scrolled to
      target: 0,
      last: 0,
      // how tall the content of the page is
      // updated in the onResize method
      limit: 0
    };
  }

  // notice how we haven't called this in the constructor, we will call it in the page classes we extend this from
  create() {
    // grab the pages main class .detail, .about, .home etc
    this.element = document.querySelector(this.selector);
    // create an empty object we can add elements too
    this.elements = {};

    // loop through each key in the selectorChildren object
    for (const key in this.selectorChildren) {
      // grab the value
      const entry = this.selectorChildren[key];
      // if the value is an Element, NodeList or Array we can add them to the elements object without doing anything
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        // if we pass anything else e.g a string like ".about__button"
        // get all of the elements of that type on the page
        this.elements[key] = document.querySelectorAll(entry);
        // if the element doesnt exist, return null
        if (this.elements[key].length === 0) {
          this.elements[key] = null;
          // if there is only a single element store only that element
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    }
  }

  // the show and hide animation
  show() {
    // use a promise here so we can use async await
    return new Promise((resolve) => {
      // create a timeline
      this.animationIn = GSAP.timeline();
      // we will fade in the content
      this.animationIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );
      // once the content is faded is we add the event listeners
      // and resolve the promise
      this.animationIn.call(() => {
        this.addEventListeners();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      // remove any event listeners
      this.removeEventListeners();
      // create an animation timeline
      this.animationIn = GSAP.timeline();
      // fade the content out
      this.animationIn.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  onMouseWheel(event) {
    // The deltaY property returns a positive value when scrolling down, and a negative value when scrolling up, otherwise 0.
    const { deltaY } = event;
    // amend the scroll target value
    // this is the value we will be "lerping to"
    // not watched but this might help: https://www.youtube.com/watch?v=8uLVnM36XUc
    this.scroll.target += deltaY;
  }

  update() {
    // set a lower and higher limit so we cant scroll to far either way
    this.scroll.target = GSAP.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    // transition from the current scroll position to the target
    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    // a small bug pointed out by Luis which can be fixed using the below
    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    // if a wrapper exists translate the wrapper
    // if not do nothing
    if(this.elements.wrapper) {
      this.elements.wrapper.style.transform = `translateY(-${this.scroll.current}px)`
    }
  }

  onResize () {
    // if a wrapper exists set the current height of the content
    // we will compare this value to our scroll so we know if we have reached the end or not
    if (this.elements.wrapper){
        this.scroll.limit =
          this.elements.wrapper.clientHeight - window.innerHeight;
    }
  }

  addEventListeners() {
    // add the event listener and call onMouseWheel
    // notice the use of an arrow function here instead of using bind
    // I find it clearer personally
    window.addEventListener('wheel', (e) => this.onMouseWheel(e));
  }

  removeEventListeners() {
    window.removeEventListener('wheel', (e) => this.onMouseWheel(e));
  }
}
