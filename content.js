let results = [];
let index = -1;

const getResults = () => {
	const searchResults = document.querySelectorAll("#search-result > li");
	return Array.from(searchResults).filter((result) => {
		return !(
			result.classList.contains("Root-FuturisSearchOuter") ||
			result.classList.contains("SearchResultsHeader") ||
			result.classList.contains("serp-item__futuris-snippet") ||
			result.classList.contains("FactHeader") ||
			result.querySelector("div.Translate") !== null
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
	const searchbar = document.querySelector('input[name="text"]');
	if (document.activeElement === searchbar) {
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
			// TODO: open in new background tab
			window.open(link.href, "_blank");
			return;
		}

		window.open(link.href, "_blank");
	}
	if (e.key === "Escape") {
		deselectResults();
		e.preventDefault();
	}
};

updateResults();
document.addEventListener("keydown", handleKeydown);

const observer = new MutationObserver(updateResults);
const content = document.querySelector(".main__content");
observer.observe(content, {
	childList: true,
	subtree: true,
});
