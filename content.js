let results = [];
let index = -1;

const getResults = () => {
	const searchResults = document.querySelectorAll("#search-result > li");
	return Array.from(searchResults).filter((result) => {
		const computedStyle = window.getComputedStyle(result);
		const isVisible = computedStyle.display !== "none";

		return (
			isVisible &&
			!(
				result.classList.contains("Root-FuturisSearchOuter") ||
				result.classList.contains("SearchResultsHeader") ||
				result.classList.contains("serp-item__futuris-snippet") ||
				result.classList.contains("FactHeader") ||
				result.classList.contains("serp-item_card-metadoc") ||
				result.querySelector("div.Translate") !== null
			)
		);
	});
};

const updateResults = () => {
	results = getResults();
	index = -1;
};

const selectResult = (index) => {
	for (const result of results) {
		result.classList.remove("highlight");
	}
	if (results[index]) {
		results[index].classList.add("highlight");
		results[index].scrollIntoView({
			behavior: "instant",
			block: "center",
		});
	}
};

const deselectResults = () => {
	for (const result of results) {
		result.classList.remove("highlight");
	}
	window.scrollTo({
		top: 0,
		behavior: "instant",
	});
	index = -1;
};

const handleKeydown = (e) => {
	if (e.key === "Escape") {
		deselectResults();
	}

	const searchbar = document.querySelector(".HeaderForm-Input");
	if (document.activeElement === searchbar) {
		// console.log('search input is active')
		return;
	}

	if (e.key === "ArrowDown" && index < results.length - 1) {
		index++;
		selectResult(index);
		e.preventDefault();
	}
	if (e.key === "ArrowUp" && index > 0) {
		index--;
		selectResult(index);
		e.preventDefault();
	}
	if (e.key === "Enter" && index >= 0) {
		const link = results[index].querySelector("a");
		if (!link) return;

		e.preventDefault();

		if (e.ctrlKey || e.metaKey) {
			newTab(link.href);
			return;
		}

		window.open(link.href, "_blank");
	}
};

const newTab = (url) => {
	browser.runtime
		.sendMessage({ command: "createTab", url })
		.then((response) => {
			console.log(response.status);
		})
		.catch((error) => console.error("Error sending message:", error));
};

updateResults();
document.addEventListener("keydown", handleKeydown);

const observer = new MutationObserver(updateResults);
const content = document.querySelector(".main__content");
observer.observe(content, {
	childList: true,
	subtree: true,
});
