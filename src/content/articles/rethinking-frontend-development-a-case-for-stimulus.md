---
draft: true
title: "Signals are here and Hypermedia has returned, now Stimulus demands attention"
description: asdnkajsn
datePublished: 2024-06-24
tags:
  - JavaScript
  - UI/UX
# https://youtube.com/clip/UgkxQ6PnTs7YylC86FQ9pRCvzASqdIj6yUGx?si=O96-nVPYT61s-izN
# https://youtube.com/clip/UgkxLAVixoBfIy-VAFwqK6ZaHgTIwLCZnpqO?si=hXBNKuXl9A3xIpYb
---

I, like many developers currently, are just now discovering the [once appreciated](https://github.com/MoOx/pjax) approach of building [Hypermedia](https://hypermedia.systems/hypermedia-reintroduction)-driven web applications. This, simply put, means utilising all of the REST methods semantics and fetching pure HTML from the server to be swapped directly into the DOM, as opposed to fetching JSON and using a framework such as React to render it as HTML on the client. 

This approach moves the rendering to the server (or edge function), most commonly achieved through a templating engine, and makes all of your framework code responsible for fetching JSON and rendering it as HTML obsolete. 

This is great but everyone now and again a little client-side interactivity is needed for components such as menus. Components that must not require a network request to work. Thus, many developers turn to using a library like React with their server though [inertia](https://inertiajs.com) or a scripting language inside their HTML like [Alpine.js](https://alpinejs.dev) or [\_hyperscript](https://hyperscript.org) - popular with [htmx](https://htmx.org) developers.

My goal is to convince you that Stimulus, when paired with Signals and the Hypermedia-driven approach to building web applications, should be taken seriously as a 

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

Yeah... I'm not a fan of JSON objects in my HTML either. Look and the code above and now realise that this example doesn't correctly handle any accessibility requirements such as setting the `aria-expanded` attribute on click, `aria-controls` and `aria-controlled-by` attributes and handling keyboard control. This logic demands its own file.

While I am well aware you can reuse `x-data` contexts in Alpine with `Alpine.data(...)`, this still doesn't address the inability to compose multiple components' logic together on a single piece of markup e.g. `x-data="component-1 component-2"` and this is a problem that isn't solved by React either! Allow me to explain, take these React components for example:

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

Here are those same components (called controllers) in Stimulus:

```js
import { Controller } from "@hotwired/stimulus";

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

I try to avoid classes to but you have to admit - this is a good use case for them. Here is what the markup loops like to attatch these controllers to the DOM:

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

<!-- A hybrid counter-dropdown -->
<div data-controller="dropdown" data-dropdown-expanded-value="false">
  <button data-controller="counter" data-counter-count-value="0" data-action="counter#increment dropdown#toggle">Count 0</button>
  <div data-dropdown-target="content">
    Some menu or something.
  </div>
</div>
```

As you can see there is no duplication of logic, multiple controllers are seamlessly used on the same markup or different markup - it doesn't matter. 

The one gripe that React developers always have to this approach, is the lack of reactivity. With no obvious way to update the DOM when a controller property changes.

Lucky for you, your favourite reactive frameworks are all using signals for reactivity under the hood these days anyway and they don't require a framework/library to use, in fact, [they are coming straight to vanilla JavaScript](https://github.com/tc39/proposal-signals). 

## Addressing Reactivity with Signals


```js
// effect.js
import { Signal } from "signal-polyfill";
// This function would usually live in a library/framework, not application code
// NOTE: This scheduling logic is too basic to be useful. Do not copy/paste.
let pending = false;

let w = new Signal.subtle.Watcher(() => {
    if (!pending) {
        pending = true;
        queueMicrotask(() => {
            pending = false;
            for (let s of w.getPending()) s.get();
            w.watch();
        });
    }
});

// An effect effect Signal which evaluates to cb, which schedules a read of
// itself on the microtask queue whenever one of its dependencies might change
export function effect(cb) {
    let destructor;
    let c = new Signal.Computed(() => { destructor?.(); destructor = cb(); });
    w.watch(c);
    c.get();
    return () => { destructor?.(); w.unwatch(c) };
}
```

```js
import { Controller } from "@hotwired/stimulus";
import { Signal } from "signal-polyfill";
import { effect } from "./effect.js";

export default class Counter extends Controller {
  static values = {
    count: Number
  };

  connect() {
    this.count = new Signal.State(this.countValue);
    effect(this.render.bind(this));
  }

  increment() {
    this.count.set(this.count.get() + 1);
  }

  render() {
    this.element.textContent = `Count ${this.count.get()}`;
  }
}
```

The best part is that, though we are handling 99% of our HTML rendering with a Hypermedia library such as htmx, Unpoly or Turbo and a template engine on the backend, you can still use the same fine-grained reactivity that underpins SolidJS. 

What makes it an even better pairing with these Hypermedia libraries is the fact they all share the same idea - serve HTML then use JavaScript to swap it onto the page where we want it. Since Stimulus was built by to be used with Turbo (another Hypermedia library) as part of the Hotwired suite of libraries, Stimulus controllers automatically hydrate as they hit the DOM which you may controll wth the `connect` and `disconnect` lifecycle methods. 

I prefer Unpoly over Turbo or htmx personally, so having Stimulus work seamlessly with Unpoly is just icing on the cake. 

## My Challenge to You

Try building a Hypermedia driven web application and if you find you need a little interactivity, give Stimulus a go and if you need a little reactivity pair it with signals. I promise that even if you hate it, you will at least have built something without using JSON for once and probably learnt something about how your favourite framework works under the hood. Heck, use React for rendering HTML on the backend if you must, just give it a go. Let me know how it goes.

## Further Reading

- [Stimulus Documentation](https://stimulus.hotwired.dev)
- [TC39 Proposal - Signals](https://github.com/tc39/proposal-signals)
