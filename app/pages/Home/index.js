import Page from '../../classes/Page';

// we extend the Page class so we can reuse all of its methods and properties
export default class Home extends Page {
  constructor() {
    // we have to call super here so we don't overwrite everything we're extending from the Page class
    super({
      id: 'home',
      element: '.home',
      // notice how we have a range of ways to select elements, this is what we're handling in our create() method
      elements: {
        navigation: document.querySelector('.navigation'),
        link: '.home__link',
      },
    });

    this.create();
  }
}
