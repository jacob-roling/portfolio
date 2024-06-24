---
draft: true
title: "Signals are here and Hypermedia has returned, now Stimulus demands your attention"
description: asdnkajsn
datePublished: 2024-06-24
tags:
  - JavaScript
  - UI/UX
# https://youtube.com/clip/UgkxQ6PnTs7YylC86FQ9pRCvzASqdIj6yUGx?si=O96-nVPYT61s-izN
# https://youtube.com/clip/UgkxLAVixoBfIy-VAFwqK6ZaHgTIwLCZnpqO?si=hXBNKuXl9A3xIpYb
---

I know my frontend journey wasn't unique in the slightest, I went from vanilla JS, HTML and CSS to component frameworks like React, Vue, Angular and Svelte but then I decided to learn backend development and everything changed.

I, like many developers currently, are discovering the value of [Hypermedia](https://hypermedia.systems/hypermedia-reintroduction)-driven web applications as opposed to fetching and converting JSON to HTML on the client-side. 

The problem with this approach is that everyone still needs a little client-side interactivity here and there, and for components such as menus, that shouldn't require a network request.

So many developers either turn back to React (using [inertia](https://inertiajs.com)) or use a scripting language inside their HTML like [Alpine.js](https://alpinejs.dev) or [\_hyperscript](https://hyperscript.org) - popular with [htmx](https://htmx.org) developers.

## The Problem

My first issue with these solutions is that they require polluting your HTML with JavaScript that has no types, no intellisense and no syntax highlighting. Here is an example of an Alpine.js accordion component:

```html
<div
  x-data="{ 
        activeAccordion: '', 
        setActiveAccordion(id) { 
            this.activeAccordion = (this.activeAccordion == id) ? '' : id 
        } 
    }"
>
  <div x-data="{ id: $id('accordion') }">
    <button @click="setActiveAccordion(id)">Accordion 1</button>
    <div x-show="activeAccordion==id" x-collapse x-cloak>
      <p>Lorum ipsum dolor sit amet.</p>
    </div>
  </div>
  <div x-data="{ id: $id('accordion') }">
    <button @click="setActiveAccordion(id)">Accordion 2</button>
    <div x-show="activeAccordion==id" x-collapse x-cloak>
      <p>Lorum ipsum dolor sit amet.</p>
    </div>
  </div>
  <div x-data="{ id: $id('accordion') }">
    <button @click="setActiveAccordion(id)">Accordion 3</button>
    <div x-show="activeAccordion==id" x-collapse x-cloak>
      <p>Lorum ipsum dolor sit amet.</p>
    </div>
  </div>
</div>
```

Look and the code above and now realise that this example doesn't even correctly handle any accessibility requirements such as correctly setting the `aria-expanded` attribute on click, setting `aria-controls` and `aria-controlled-by` attributes and handling keyboard control. Yeah... I'm not a fan of JSON objects in my HTML either. This logic demands its own file.

While I am well aware you can reuse `x-data` contexts in Alpine with `Alpine.data(...)`, this still doesn't address the inability to compose multiple components' logic together on a single piece of markup I.E. `x-data="component-1 component-2"` and this is a problem that isn't solved by React either! Allow me to explain, take these React components for example:

```jsx
import { useState } from "react"

export default function Dropdown({ expanded: initialExpanded, title, children }) {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>{title}</button>
      <div aria-expanded={expanded}>{children}</div>
    </div>
  );
}

export default function Counter({ count: initialCount }) {
  const [count, setCount] = useState(initialCount);

  return (
    <button onClick={() => setCount(count + 1)}>Count {count}</button>
  )
}
```

Now, have a think about how you would use this logic to write markup that renders a dropdown, a counter button and a counter button that also functions as a dropdown. The dropdown and counter by themselves are easy enough but combining that logic together into a counter-dropdown either requires that you write a third "CounterDropdown" component and duplicate the logic you already wrote, or, extract each piece of state into its own utility function that you can pull into each component where you still have to manually link up the event handlers each time. 

If only the logic was decoupled from the markup...

## Enter Stimulus

> A modest JavaScript framework for the HTML you already have. - <cite>[Stimulus](https://stimulus.hotwired.dev)</cite>

```js
import { Controller } from "stimulus"

export default class Dropdown extends Controller {
  static targets = [ "content" ];
  static values = {
    expanded: Boolean
  };

  toggle() {
    this.expandedValue = !this.expandedValue;
  }

  expandedValueChanged() {
    this.contentTarget.setAttribute("aria-expanded", this.expandedValue);
  }
}

export default class Counter extends Controller {
  static values = {
    count: Number
  };

  increment() {
    this.countValue += 1;
  }

  countValueChanged() {
    this.element.textContent = `Count ${this.countValue}`;
  }
}
```

```html
<!-- A counter -->
<button data-controller="counter" data-counter-count-value="0" data-action="increment">Count 0</button>

<!-- A dropdown -->
<div data-controller="dropdown">
  <button data-action="toggle">Dropdown</button>
  <div data-dropdown-target="content">
    Some menu or something.
  </div>
</div>

<!-- A counter-dropdown -->
<div data-controller="dropdown" data-dropdown-expanded-value="false">
  <button data-controller="counter" data-counter-count-value="0" data-action="counter#increment dropdown#toggle">Count 0</button>
  <div data-dropdown-target="content">
    Some menu or something.
  </div>
</div>

```

I try to avoid classes to but you have to admit - this is a good use case for them. 

Well lucky for you, your favourite reactive frameworks are all using signals for reactivity under the hood these days anyway and they don't require a framework/library to use, in fact, [they are coming straight to vanilla JavaScript](https://github.com/tc39/proposal-signals). 

## Addressing Reactivity with Signals



## Further Reading

- [Stimulus Documentation](https://stimulus.hotwired.dev)
- [TC39 Proposal - Signals](https://github.com/tc39/proposal-signals)
