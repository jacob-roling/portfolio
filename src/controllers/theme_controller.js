import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    const theme = localStorage.getItem("theme");
    // this.metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      this.element.value = theme;
    }

    this.element.addEventListener("change", this.switch.bind(this));
  }

  switch() {
    if (this.element.value == "auto") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", this.element.value);
    }
    document.documentElement.setAttribute("data-theme", this.element.value);
    this.dispatch("switch", { detail: this.element.value });
  }
}
