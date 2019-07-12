import {html} from '@polymer/polymer/polymer-element.js';

import {DelayedElement} from './delayed-element.js';

/**
 * `delayed-picture`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class DelayedPicture extends DelayedElement {
  static get template() {
    return html`
      <style>
          :host {
              /* workaround for Edge intersectionObserverApi bug*/
              display: inline-block;
              min-width: 1px;
          }
      </style>
      <slot on-slotchange="_onSlotChange"></slot>
    `;
  }

  static get properties() {
    return {
      alt: {type: String, value: ''},
      _sources: Array,
      _img: Object
    };
  }

  load() {
    // slotchange event does not fired in safari 11
    if (!this._sources) {
      this._onSlotChange();
    }
    let sources = this._sources;
    if (sources.length > 0) {
      let picture = document.createElement('picture');

      for (let i = 0, len = sources.length; i < len; i++) {
        let source = sources[i];
        if (!source.getAttribute('srcset')) {
          source.setAttribute('srcset', source.getAttribute('src'));
        }
        source.removeAttribute('src');
        picture.appendChild(source);
      }

      picture.appendChild(this._img);
      this.appendChild(picture);
      this._removeSize();
    }
  }

  _onSlotChange() {
    if (!this._sources) {
      this._sources = this._getSources();
      if (this._sources.length > 0) {
        this._setSize();

        this._img = document.createElement('img');
        this._img.setAttribute('alt', this.alt);
        this._img.className = this.className;
        this.removeAttribute('class');
        this.removeAttribute('alt');
        this.appendChild(this._img);
      }
    }
  }


  _getSources() {
    let sources = [];
    for (let i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i].tagName === 'SOURCE') {
        sources.push(this.children[i]);
      }
    }
    return sources;
  }

  _setSize() {
    let sources = this._sources;
    let activeSource;
    let withSizes = 0;
    for (let i = 0, len = sources.length; i < len; i++) {
      let source = sources[i];
      if (source.getAttribute('sizes') && source.dataset.aspectRatio) {
        withSizes++;
      }
      let media = source.getAttribute('media');
      if (!activeSource && (!media || matchMedia(media).matches)) {
        activeSource = source;
      }
    }
    if (withSizes === sources.length && activeSource) {
      this.style.width = this._parseWidth(activeSource.getAttribute('sizes'));
      this.style.maxWidth = '100%';
      this.style.paddingTop = parseFloat(activeSource.dataset.aspectRatio) * 100 + '%';
    }
  }

  _parseWidth(sizes) {
    sizes = sizes.split(',');
    let width = sizes.pop().trim();
    let len = sizes.length;
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        let matches = sizes[i].match(/(\(.*?\)) (.*)/);
        if (matchMedia(matches[1]).matches) {
          width = matches[2].trim();
          break;
        }
      }
    }
    return width;
  }

  _removeSize() {
    this.style.removeProperty('padding-top');
    this.style.removeProperty('width');
    this.style.removeProperty('max-width');
  }
}

window.customElements.define('delayed-picture', DelayedPicture);
