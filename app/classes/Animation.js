export default class Animation {
    constructor({element}) {
        // set the element
        this.element = element
        // initialise the observer
        this.createObserver()
    }

    createObserver() {
        // we shouldn't need window here but eslint is complaining
        this.observer = new window.IntersectionObserver(entries => {
            // loop through each entry
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    console.log("animate in")
                    this.animateIn();
                } else {
                    console.log("animate out");
                    this.animateOut();
                }
            })
        });

        this.observer.observe(this.element)
    }

    // blank methods are added so we get no error in the browser
    // these are overwritten when we extend the class
    animateIn() {

    }

    // blank methods are added so we get no error in the browser
    // these are overwritten when we extend the class
    animateOut() {

    }
}