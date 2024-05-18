---
title: htmx Route Announcer
description: htmx Route Announcer makes htmx navigation accessible by adding an new element with the 'aria-live' attribute set to 'assertive' after new content is swapped in. This tells AT (assistive technology) to announce the new route immediately.
datePublished: 2024-05-13
tags:
  - Project
---

htmx Route Announcer makes htmx navigation accessible by adding an new element with the `aria-live` attribute set to `assertive` after new content is swapped in. This tells AT (assistive technology) to announce the new route immediately. The extension checks for the following, in priority order, to determine the announcement text:

1. The `<title>`, if it exists.
2. The first `<h1>` it finds.
3. The `pathname` of the page.

Repository: [jacob-roling/htmx-route-announcer](https://github.com/jacob-roling/htmx-route-announcer)
