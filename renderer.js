const setButton = document.getElementById("setBtnDOM");
const titleInput = document.getElementById("title");
const btn = document.getElementById("btn");
const filePathElement = document.getElementById("filePath");

setButton.addEventListener("click", () => {
	const title = titleInput.value;
	window.electronAPI.setTitle(title);
});

btn.addEventListener("click", async () => {
	const filePath = await window.electronAPI.openFile();
	filePathElement.innerText = filePath;
});

const counter = document.getElementById("counter");

window.electronAPI.onUpdateCounter(value => {
	const oldValue = Number(counter.innerText);
	const newValue = oldValue + value;
	counter.innerText = newValue.toString();
	window.electronAPI.counterValue(newValue);
});