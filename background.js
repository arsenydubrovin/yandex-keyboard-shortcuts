const newTab = (url) => {
	browser.tabs.create({
		url: url,
		active: false,
	});
};

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.command === "createTab") {
		newTab(message.url);
		sendResponse({ status: "Tab created" });
	}
});
