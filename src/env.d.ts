/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
<<<<<<< HEAD
  htmx: import("htmx.org");
=======
  up: any;
>>>>>>> 40dd981 (chore: savepoint)
  posthog: import("posthog-js");
  Stimulus: import("@hotwired/stimulus").Application;
  recalculateHeaderSpacing: import("#utils").recalculateHeaderSpacing;
}
