import { each } from 'lodash';
import Preloader from './components/Preloader';
import About from './pages/About';
import Collections from './pages/Collections';
import Detail from './pages/Detail';
import Home from './pages/Home';

class App {
  // a constructor is called on initilisation aka new App();
  constructor() {
    this.createPreloader();
    this.createContent();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();

    this.update();
  }

  createPreloader() {
    // initialise the preloader
    this.preloader = new Preloader();
    // once the "completed" event has been emitted, run onPreloaded
    this.preloader.once('completed', () => this.onPreloaded());
  }

  // createContent is an example of a method, we can then access this via this.createContent
  createContent() {
    // grab the current content and store it
    this.content = document.querySelector('.content');
    // grab the current template and store it
    this.template = this.content.getAttribute('data-template');
  }

  // we create a map of all of our routes and their corresponding Classes
  createPages() {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home(),
    };

    // we initialise the page class that matches the current template
    this.page = this.pages[this.template];
    // we call the create and show methods from the Page Class we have extended
    this.page.create();
  }

  onPreloaded() {
    // destroy the preloader when everything has loaded
    this.preloader.destroy();
    // resize the height of the content
    this.onResize();
    // only animate the page in when the preloader has been destroyed
    this.page.show();
  }

  // called from addLinkListeners on every link click
  async onChange(url) {
    // hide the page
    await this.page.hide();
    // fetch the next page
    const response = await window.fetch(url);
    // if the response status is 200 we can do something
    if (response.status === 200) {
      // get the html content from the response
      const html = await response.text();
      // create an empty div
      const div = document.createElement('div');
      // insert the html we fetched
      div.innerHTML = html;
      // query .content (because we don't want to add all of the head and footer content etc)
      const divContent = div.querySelector('.content');
      // update the current template
      this.template = divContent.getAttribute('data-template');
      // change the template in the html
      this.content.setAttribute(
        'data-template',
        divContent.getAttribute('data-template')
      );
      // replace the current content with the next pages content
      this.content.innerHTML = divContent.innerHTML;
      // update the page to initialise the new page class
      this.page = this.pages[this.template];
      // create the new page, show it and add link listeners
      this.page.create();
      // get the current content height and update our scroll limit
      this.onResize();
      // show the page
      this.page.show();
      // listen for any clicks and run onChange
      this.addLinkListeners();
    } else {
      console.log('Error fetching page');
    }
  }

  onResize() {
    // get the height of the pages content and update the scroll limit
    if (this.page && this.page.update) {
      this.page.onResize();
    }
  }

  update() {
    // if the page has been created and the update method exists run the update method
    // the page update method sets our current and target scroll position and transitions smoothly between the two
    if (this.page && this.page.update) {
      this.page.update();
    }
    // we re run this method on every animation frame
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    this.frame = window.requestAnimationFrame(() => this.update());
  }

  addEventListeners() {
    // when we resize the viewport our contents height will change
    // we need to update our scroll limit whenever that happens
    window.addEventListener('resize', (e) => this.onResize(e));
  }

  addLinkListeners() {
    // get all of the links on the page
    const links = document.querySelectorAll('a');
    // loop through each link
    each(links, (link) => {
      // when the link it clicked do something
      link.onclick = (event) => {
        // prevent the default bahaviour (navigating to the page)
        event.preventDefault();
        // get the url of the link
        const { href } = link;
        // call the onChange method, passing in the url as an argument
        this.onChange(href);
      };
    });
  }
}

new App();
