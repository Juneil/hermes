import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';

import './components/side-panel';
import './components/main-panel';

import { DefaultTheme as Theme } from '../common';

document.onload = () => {
    document.body.style.background = Theme.BACKGROUND_COLOR;
    document.body.style.color = Theme.TEXT_COLOR;
}
