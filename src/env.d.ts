/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  htmx: import("htmx.org");
  posthog: import("posthog-js");
}
