import EventEmitter from 'events';

// This will be a class we can reuse for all of the pages
export default class Component extends EventEmitter {
  // on initialisation we will grab the main page element (this.selector), whatever elements we need (this.selectorChildren) and the page id
  constructor({ element, elements }) {
    super();

    this.selector = element;
    this.selectorChildren = { ...elements };

    this.create();
    this.addEventListeners();
  }

  // notice how we haven't called this in the constructor, we will call it in the page classes we extend this from
  create() {
    // not too sure what is happening here tbh
    if(this.selector instanceof window.HTMLElement){
      this.element = this.selector;
    } else {
      // grab the pages main class .detail, .about, .home etc
      this.element = document.querySelector(this.selector);
    }
    
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

  addEventListeners() {}

  removeEventListeners() {}
}
