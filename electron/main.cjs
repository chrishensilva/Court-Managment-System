const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { Worker } = require('worker_threads');

function startBackend() {
    try {
        const worker = new Worker(path.join(__dirname, 'server.cjs'), {
            workerData: {
                userDataPath: app.getPath('userData'),
                isPackaged: app.isPackaged
            }
        });

        worker.on('error', (error) => {
            console.error('Worker thread error:', error);
            dialog.showErrorBox('Backend Worker Error', error.message);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });

        console.log('Backend server started in worker thread.');
    } catch (error) {
        console.error('Failed to start server worker:', error);
        dialog.showErrorBox('Startup Error', `Failed to initialize the application backend worker.\n\nError: ${error.message}`);
    }
}

app.whenReady().then(() => {
    startBackend();
    createWindow();
});




function createWindow() {
    const isDev = !app.isPackaged;
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
        icon: path.join(__dirname, '../src/assets/icon2.png'),
        title: "Case Management System"
    });

    // Toggle DevTools automatically in dev mode
    if (isDev) {
        win.webContents.openDevTools();
    }

    // Load the app
    const startURL = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    win.loadURL(startURL);

    // Remove default menu
    win.setMenu(null);
}



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
