/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  up: any;
  posthog: import("posthog-js");
  Stimulus: import("@hotwired/stimulus").Application;
  recalculateHeaderSpacing: import("#utils").recalculateHeaderSpacing;
}
