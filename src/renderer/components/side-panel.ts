import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';

class SidePanel extends PolymerElement {

    list: string[];

    constructor() {
        super();
        this.list = ['status', '#chan1', '#quizz'];
    }

    static get template() {
        return html`
            <style>
                :host {
                    border-right: 1px solid #516dab;
                    display: flex;
                    flex: 0 0 125px;
                }
                p {
                    margin: 0;
                }
                div {
                    padding: 5px;
                }
                span {
                    color: #ffff77;
                }
            </style>
            <div>
                <template is="dom-repeat" items="[[list]]">
                    <p><span><strong>1.</strong></span>{{item}}</p>
                </template>
            </div>
        `;
    }
}

customElements.define('side-panel', SidePanel);