import { Controller } from "@hotwired/stimulus";
import { importStatic } from "#utils";

export default class extends Controller {
  static targets = ["dialog", "input", "placeholder", "results"];

  initialize() {
    this.abortController = new AbortController();
  }

  async connect() {
    this.pagefind = await importStatic("/pagefind/pagefind.js");
    this.pagefind.init();

    this.debounce;

    window.addEventListener(
      "keydown",
      (event) => {
        if (event.ctrlKey && event.key === "k") {
          event.preventDefault();
          this.showModal();
        }
      },
      {
        signal: this.abortController.signal,
      },
    );
  }

  inputTargetConnected(input) {
    input.addEventListener(
      "keydown",
      (event) => {
        if (event.code == "Tab") {
          return;
        }
        this.search(event.target.value);
      },
      {
        signal: this.abortController.signal,
      },
    );
  }

  showModal() {
    this.dialogTarget.showModal();
  }

  close() {
    this.dialogTarget.close();
  }

  search(query) {
    this.resultsTarget.replaceChildren();
    clearTimeout(this.debounce);
    this.debounce = setTimeout(async () => {
      const search = await this.pagefind.search(query);
      const children = search.results.map(() => {
        const clonedFragment = this.placeholderTarget.content.cloneNode(true);
        const child = document.createElement("li");
        this.resultsTarget.appendChild(child);
        while (clonedFragment.firstChild) {
          child.appendChild(clonedFragment.firstChild);
        }
        return child;
      });

      search.results.map((result, i) =>
        result.data().then(({ url, meta: { title }, excerpt }) => {
          const item = document.createElement("li");
          item.setAttribute("class", "relative");

          const href = document.createElement("a");
          href.setAttribute("href", url.length > 1 ? url.slice(0, -1) : url);
          href.setAttribute("data-action", "pagefind#close");

          const heading = document.createElement("h3");
          heading.textContent = title;
          const span = document.createElement("span");
          span.setAttribute("class", "expand-to-relative");
          span.setAttribute("aria-hidden", "true");

          heading.appendChild(span);
          href.appendChild(heading);
          item.appendChild(href);

          const p = document.createElement("p");
          p.innerHTML = excerpt;

          item.appendChild(p);

          this.resultsTarget.replaceChild(item, children[i]);
          up.hello(href);
        }),
      );
    }, 250);
  }

  disconnect() {
    this.abortController.abort();
  }
}
