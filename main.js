const { app, BrowserWindow, ipcMain, dialog, Menu, Notification } = require("electron");
const path = require("node:path");

function handleSetTitle (event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

async function handleFileOpen() {
	const { canceled, filePaths } = await dialog.showOpenDialog();
	if (!canceled) {
		return filePaths[0];
	}
}

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	const menu = Menu.buildFromTemplate([
		{
			label: app.name,
			submenu: [
				{
					click: () => mainWindow.webContents.send("update-counter", 1),
					label: "Increment",
				},
				{
					click: () => mainWindow.webContents.send("update-counter", -1),
					label: "Decrement",
				},
			],
		},
	]);

	Menu.setApplicationMenu(menu);
	mainWindow.loadFile("index.html");

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
};
const NOTIFICATION_TITLE = "Basic Notification";
const NOTIFICATION_BODY = "Notification from the Main process";

function showNotification() {
	new Notification({
		title: NOTIFICATION_TITLE,
		body: NOTIFICATION_BODY,
	}).show();
}
app
	.whenReady()
	.then(() => {
		ipcMain.on("set-title", handleSetTitle);
		ipcMain.handle("dialog:openFile", handleFileOpen);
		ipcMain.on("counter-value", (_event, value) => {
			console.log(value); // will print value to Node console
		});
		createWindow();
		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) createWindow();
		});
	})
	.then(showNotification);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});