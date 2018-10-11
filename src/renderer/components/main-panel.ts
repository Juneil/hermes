import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import * as Moment from 'moment';
import '@polymer/polymer/lib/elements/dom-repeat.js';

class MainPanel extends PolymerElement {

    constructor() {
        super();
    }

    targetFormat(target: string): string {
        const length = 10;
        if (target.length >= length) {
            target = target.slice(0, length);
        } else {
            let spaces = '';
            for (let i = 0; i < (length - target.length); i++) {
                spaces += '&nbsp;';
            }
            target = spaces + target;
        }
        return `${Moment().format('HH:mm:ss')} ${target} |`;
    }

    keyDown(event: any) {
        if (event.keyCode === 13) {
            const message = document.createElement('p');
            message.innerHTML = `${this.targetFormat('Juneil')} ${(<any>this.$.input).value}`;
            (<any>this.$.input).value = '';
            this.$.messages.appendChild(message);
        }
    }

    static get template() {
        return html`
            <style>
                :host {
                    display: flex;
                    flex: 1;
                }
                p {
                    margin: 0;
                    padding: 0 5px;
                }
                .bar_color {
                    background-color: #516dab;
                }
                .bar {
                    flex: 0;
                    padding: 3px;
                }
                .main_view {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                .main_view div {
                    flex: 1;
                }
                #messages {
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }
                input {
                    border: 0;
                    outline: none;
                    background: black;
                    color: white;
                    font-family: 'Inconsolata', monospace;
                    line-height: 16px;
                    font-size: 16px;
                }
            </style>
            <div class="main_view">
                <p class="bar bar_color">Hermes ...</p>
                <div id="messages"></div>
                <p class="bar bar_color">info channel - ddd - pp</p>
                <input id="input" class="bar" type="text" on-keydown="keyDown"></input>

            </div>
        `;
    }
}

customElements.define('main-panel', MainPanel);