import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
// import { IRC } from './irc';

const baseUrl = process.env.NODE_ENV === 'development' ?
  path.join(process.cwd(), './dist') :
  path.join(process.cwd())

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 1000,
    height: 600,
    width: 1000
  });
  mainWindow.setMenu(null);
  mainWindow.setTitle(`${process.env.npm_package_name} v${process.env.npm_package_version}`);
  mainWindow.loadURL(url.format({
    pathname: path.join(baseUrl, './index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  mainWindow.on('closed', () => {
    mainWindow = null as any;
  });
  mainWindow.webContents.openDevTools();
  // new IRC().open('irc.europnet.org', 6667);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
