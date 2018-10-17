import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Subject } from 'rxjs';
import { StreamValue, DefaultTheme as Theme } from '../../common';
import * as Electron from 'electron';
import '@polymer/polymer/lib/elements/dom-repeat.js';

import { Formatter } from '../services/format';

class MainPanel extends PolymerElement {

    stream: Subject<StreamValue> = new Subject();

    constructor() {
        super();
        Electron.ipcRenderer.on('msg', (_: any, arg: any) => this.stream.next(JSON.parse(arg)));
        this.stream.subscribe(msg => this.addContent(msg.prefix || '***', `${msg.command} ${msg.params.join(' ')}`));
    }

    charWidth(): number {
        const element = document.createElement('span');
        element.innerText = 'x';
        document.body.appendChild(element);
        const width = element.getBoundingClientRect().width;
        document.body.removeChild(element);
        return width;
    }

    keyDown(event: any) {
        if (event.keyCode === 13) {
            this.addContent('IAmMe007', (<any>this.$.input).value + 'yo \x02BolD \x033\x1Fcolored\x03 reset - \x030,5color with bg');
        }
    }

    addContent(target: string, text: string): void {
        const message = document.createElement('p');
        const panelWidth = this.$.messages.getBoundingClientRect().width;
        const maxChars = Math.floor(panelWidth / this.charWidth()) - 23;
        message.innerHTML = Formatter.format(text, target, maxChars);
        (<any>this.$.input).value = '';
        this.$.messages.appendChild(message);
    }

    static get theme() {
        return Theme
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
                    background-color: ${this.theme.DELIMITER_COLOR};
                }
                .bar {
                    flex: 0;
                    padding: 3px;
                }
                #main_view {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                #main_view div {
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
                    background: ${this.theme.BACKGROUND_COLOR};
                    color: ${this.theme.TEXT_COLOR};
                    font-family: 'Inconsolata', monospace;
                    line-height: 16px;
                    font-size: 16px;
                }
                .time_delimiter {
                    color: ${this.theme.TIME_DELIMITER_COLOR}
                }
                .separator {
                    color: ${this.theme.SEPARATOR_COLOR}
                }
                .fg-0 { color: white; }
                .fg-1 { color: black; }
                .fg-2 { color: blue; }
                .fg-3 { color: green; }
                .fg-4 { color: red; }
                .fg-5 { color: brown; }
                .fg-6 { color: purple; }
                .fg-7 { color: orange; }
                .fg-8 { color: yellow; }
                .fg-9 { color: lime; }
                .fg-10 { color: teal; }
                .fg-11 { color: cyan; }
                .fg-12 { color: royalblue; }
                .fg-13 { color: pink; }
                .fg-14 { color: grey; }
                .fg-15 { color: silver; }

                .bg-0 { background-color: white; }
                .bg-1 { background-color: black; }
                .bg-2 { background-color: blue; }
                .bg-3 { background-color: green; }
                .bg-4 { background-color: red; }
                .bg-5 { background-color: brown; }
                .bg-6 { background-color: purple; }
                .bg-7 { background-color: orange; }
                .bg-8 { background-color: yellow; }
                .bg-9 { background-color: lime; }
                .bg-10 { background-color: teal; }
                .bg-11 { background-color: cyan; }
                .bg-12 { background-color: royalblue; }
                .bg-13 { background-color: pink; }
                .bg-14 { background-color: grey; }
                .bg-15 { background-color: silver; }
            </style>
            <div id="main_view">
                <p class="bar bar_color">Hermes ...</p>
                <div id="messages"></div>
                <p class="bar bar_color">info channel - ddd - pp</p>
                <input id="input" class="bar" type="text" on-keydown="keyDown" autofocus></input>

            </div>
        `;
    }
}

customElements.define('main-panel', MainPanel);