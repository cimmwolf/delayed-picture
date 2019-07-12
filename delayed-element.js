import {PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `delayed-element`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class DelayedElement extends PolymerElement {
  static get properties() {
    return {
      height: {
        type: Number,
        value: function() {
          return document.documentElement.clientHeight;
        }
      }
    }
  }

  ready() {
    super.ready();
    try {
      this._observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.load();
          this._observer.disconnect();
        }
      }, {threshold: [0], rootMargin: '0px 0px ' + this.height + 'px'});
    } catch (e) {
      this.load();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._observer) {
      this._observer.observe(this);
    }
  }

  load() {
  }
}
