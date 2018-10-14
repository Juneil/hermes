import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Subject } from 'rxjs';
import { StreamValue } from '../../common';
import * as Moment from 'moment';
import * as Electron from 'electron';
import '@polymer/polymer/lib/elements/dom-repeat.js';

import { Formatter } from '../services/format';

class MainPanel extends PolymerElement {

    stream: Subject<StreamValue> = new Subject();

    constructor() {
        super();
        Electron
            .ipcRenderer
            .on('msg', (_: any, arg: any) => this.stream.next(JSON.parse(arg)));

        this.stream
            .subscribe(msg => this.addContent(msg.prefix || '***', `${msg.command} ${msg.params.join(' ')}`));
    }

    charWidth(): number {
        const element = document.createElement('span');
        element.innerText = 'x';
        document.body.appendChild(element);
        const width = element.getBoundingClientRect().width;
        document.body.removeChild(element);
        return width;
    }

    targetFormat(target: string): string {
        const length = 10;
        if (target.length >= length) {
            target = target.slice(0, length);
        } else {
            let spaces = '';
            for (let i = 0; i < (length - target.length); i++) {
                spaces += ' ';
            }
            target = spaces + target;
        }
        return `${Moment().format('HH:mm:ss')} ${target} |`;
    }

    convertSpace(content: string): string {
        return content.replace(/\s/g, '&nbsp;');
    }

    keyDown(event: any) {
        if (event.keyCode === 13) {
            this.addContent('IAmMe007', (<any>this.$.input).value);
        }
    }

    addContent(target: string, text: string): void {
        const content = Array.from(text);
        const message = document.createElement('p');
        const panelWidth = this.$.messages.getBoundingClientRect().width;
        const maxChars = Math.floor(panelWidth / this.charWidth()) - 23;
        let buffer = `${this.targetFormat(target)} `;
        while (content.length > 0) {
            if (buffer.length > 22) {
                buffer += '<br>' + Array(20).fill('&nbsp;').join('') + '| ';
            } else {
                buffer = this.convertSpace(buffer);
            }
            const b = content.slice(0, maxChars);
            if (b.length === maxChars && b.indexOf(' ') > -1) {
                buffer += content.splice(0, b.lastIndexOf(' ') + 1).join('').trim();
            } else {
                buffer += content.splice(0, maxChars).join('');
            }
        }
        message.innerHTML = buffer;
        (<any>this.$.input).value = '';
        this.$.messages.appendChild(message);
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
                    background: black;
                    color: white;
                    font-family: 'Inconsolata', monospace;
                    line-height: 16px;
                    font-size: 16px;
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