import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

// Define the class for a new element called custom-element
class CustomElement extends PolymerElement {
  constructor() {
    super();
    // this.textContent = 'I\'m a custom-element.';
  }
}
// Register the new element with the browser
customElements.define('custom-element', CustomElement);