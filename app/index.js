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
    this.addLinkListeners();
  }

  createPreloader () {
    // initialise the preloader
    this.preloader = new Preloader()
    // once the "completed" event has been emitted, run onPreloaded
    this.preloader.once("completed", () => this.onPreloaded);
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

  async onPreloaded () {
    // destroy the preloader when everything has loaded
    this.preloader.destroy()
    // only animate the page in when the preloader has been destroyed
    await this.page.show()
  }

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
      this.page.show();
      this.addLinkListeners();
    } else {
      console.log('Error fetching page');
    }
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
