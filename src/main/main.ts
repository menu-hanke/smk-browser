/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import path from 'path'
import { app, BrowserWindow, shell, ipcMain, dialog, clipboard } from 'electron'
import { autoUpdater } from 'electron-updater'
import { writeFile, unlink, readdir, readFile } from 'fs/promises'
import log from 'electron-log'
import MenuBuilder from './menu'
import { resolveHtmlPath } from './util'
import { FoundID } from '../renderer/types'

export default class AppUpdater {
 constructor() {
  log.transports.file.level = 'info'
  autoUpdater.logger = log
  autoUpdater.checkForUpdatesAndNotify()
 }
}

let mainWindow: BrowserWindow | null = null

ipcMain.on('ipc-example', async (event, arg) => {
 const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`
 console.log(msgTemplate(arg))
 event.reply('ipc-example', msgTemplate('pong'))
})

if (process.env.NODE_ENV === 'production') {
 const sourceMapSupport = require('source-map-support')
 sourceMapSupport.install()
}

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

if (isDevelopment) {
 require('electron-debug')()
}

const installExtensions = async () => {
 const installer = require('electron-devtools-installer')
 const forceDownload = !!process.env.UPGRADE_EXTENSIONS
 const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

 return installer
  .default(
   extensions.map((name) => installer[name]),
   forceDownload
  )
  .catch(console.log)
}

const createWindow = async () => {
 if (isDevelopment) {
  await installExtensions()
 }

 const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../../assets')

 const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths)
 }

 mainWindow = new BrowserWindow({
  show: false,
  width: 1024,
  height: 728,
  backgroundColor: 'white',
  icon: getAssetPath('icon.png'),
  webPreferences: {
   preload: path.join(__dirname, 'preload.js'),
   nodeIntegration: true,
   contextIsolation: false,
   webSecurity: false
  }
 })

 mainWindow.removeMenu()
 mainWindow.loadURL(resolveHtmlPath('index.html'))

 mainWindow.on('ready-to-show', () => {
  if (!mainWindow) {
   throw new Error('"mainWindow" is not defined')
  }
  if (process.env.START_MINIMIZED) {
   mainWindow.minimize()
  } else {
   mainWindow.show()
  }
 })

 mainWindow.webContents.on('did-frame-finish-load', () => {
  // We close the DevTools so that it can be reopened and redux reconnected.
  // This is a workaround for a bug in redux devtools.
  mainWindow?.webContents.closeDevTools()
  mainWindow?.webContents.once('devtools-opened', () => {
   mainWindow?.focus()
  })
  mainWindow?.webContents.openDevTools()
 })

 mainWindow.on('closed', () => {
  mainWindow = null
 })

 const menuBuilder = new MenuBuilder(mainWindow)
 menuBuilder.buildMenu()

 // Open urls in the user's browser
 mainWindow.webContents.on('new-window', (event, url) => {
  event.preventDefault()
  shell.openExternal(url)
 })

 // Remove this if your app does not use auto updates
 // eslint-disable-next-line
 new AppUpdater()
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
 // Respect the OSX convention of having the application in memory even
 // after all windows have been closed
 if (process.platform !== 'darwin') {
  app.quit()
 }
})

app
 .whenReady()
 .then(() => {
  createWindow()
  app.on('activate', () => {
   // On macOS it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (mainWindow === null) createWindow()
  })
 })
 .catch(console.log)

ipcMain.handle('saveFile', async (_event, obj) => {
 console.log('Saving file: ', obj.selectedPath, '/', obj.filename)

 await writeFile(`${obj.selectedPath}/${obj.filename}`, obj.data)
 return { ok: true }
})

ipcMain.handle('openFileSystem', async (_event, window) => {
 const selectedPath: string[] | undefined = dialog.showOpenDialogSync(window, {
  properties: ['openDirectory']
 })
 console.log('Got the path: ', selectedPath)
 return selectedPath && selectedPath[0]
})

ipcMain.handle('removeOldFiles', async (_event, object) => {
 const files = await readdir(object.selectedPath)
 await Promise.all(
  files.map((file: any) => {
   const fileString = file.toString()
   if (fileString.includes(object.propertyID)) {
    console.log(`Removing file: ${object.selectedPath}/${fileString}`)
    return unlink(`${object.selectedPath}/${fileString}`)
   } else {
    return Promise.resolve()
   }
  })
 )
 return { ok: true }
})

ipcMain.handle('copyToClipboard', async (_event, object) => {
 clipboard.writeText(object.logData)
 console.log(clipboard.readText('selection'))
 return { ok: true }
})

ipcMain.handle('readFilesFromDisc', async (_event, { dataById, folderPath }: { dataById: FoundID; folderPath: string }) => {
 const dataToReturn = {
  propertyId: dataById.propertyId,
  geojsonFile: await readFile(`${folderPath}/${dataById.geojsonFile}`, 'utf-8'),
  stands: [] as any[]
 }

 // Returns raw data in buffer form --> needs to be passed to xml2js.parseStringPromise()
 await Promise.all(
  dataById.stands.map(async (stand: any) => {
   const standFromFile = await readFile(`${folderPath}/${stand.standXmlFile}`)
   dataToReturn.stands.push({ patchId: stand.patchId, standXmlFile: standFromFile })
  })
 )
 console.log('Will return object: ', dataToReturn)
 return dataToReturn
})

// Example data return format

// data: {
//   propertyId: '1234',
//   propertyJson: /* JSON FILE string */,
//   stands: [{
//     standId: '4321',
//     standXML: /* XML FILE string */
//   }]
// }
