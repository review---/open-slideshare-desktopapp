'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var shell = require('shell');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  Menu.setApplicationMenu(menu);
  openWindow();
});

function openWindow() {
  // ブラウザ(Chromium)の起動, 初期画面のロード
  var win = new BrowserWindow({width: 800, height: 600 * 1.2});
  win.loadUrl('file://' + __dirname + '/index.html');
  win.on('closed', function () {
    win = null;
  });
}

// メニュー情報の作成
var template = [
  {
    label: 'OpenSlideshare',
    submenu: [
      {label: 'Quit', accelerator: 'Command+Q', click: function () {app.quit();}}
    ]
  }, {
    label: 'File',
    submenu: [
      {label: 'Open Web Site', accelerator: 'Command+O', click: function() {
        shell.openExternal('http://slide.meguro.ryuzee.com');
      }}
    ]
  }
];
var menu = Menu.buildFromTemplate(template);

// vim: ts=2 sts=2 sw=2 expandtab
