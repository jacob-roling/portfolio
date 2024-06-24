import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["list", "content"];

  // initialize() {
  //   this.abortController = new AbortController();
  // }

  connect() {
    if (!("IntersectionObserver" in window)) return;

    this.links = Array.from(this.listTarget.querySelectorAll("a").values());

    this.headings = this.links.reduce((pre, link) => {
      return pre.concat(
        document.getElementById(link.getAttribute("href").slice(1)),
      );
    }, []);

    this.observe = () => {
      if (this.observer) this.observer.disconnect();

      this.observer = new IntersectionObserver(this.setCurrent.bind(this), {
        root: document.getElementById("header"),
        rootMargin: "-100px 0px 0px 0px",
        threshold: 0.01,
      });

      this.headings.forEach((h) => this.observer.observe(h));
    };

    this.observe();

    const onIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

    let timeout;
    window.addEventListener("resize", () => {
      // Disable intersection observer while window is resizing.
      if (this.observer) this.observer.disconnect();
      clearTimeout(timeout);
      timeout = setTimeout(() => onIdle(this.observe), 200);
    });
  }

  getRootMargin() {
    // const headerHeight =
    //   document.querySelector("header").getBoundingClientRect().height || 0;
    // const top = headerHeight + 32;
    // return `-${top}px 0px ${
    //   document.documentElement.clientHeight - top - 1
    // }px 0px`;
    return "0px";
  }

  setCurrent(entries) {
    for (const {
      isIntersecting,
      target,
      rootBounds,
      boundingClientRect,
    } of entries) {
      if (!isIntersecting) continue; //  || rootBounds.top < boundingClientRect.top
      console.log(target);
      return;
    }
  }

  disconnect() {
    // this.abortController.abort();
    this.observer.disconnect();
  }
}
