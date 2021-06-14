export const saveBoardNametoLocalStorage = (boardName)=>{
	if (boardName.toLowerCase() === 'anonymous') return;
	var recentBoards, key = "recent-boards";
	try {
		recentBoards = JSON.parse(localStorage.getItem(key));
		if (!Array.isArray(recentBoards)) throw new Error("Invalid type");
	} catch(e) {
		// On localstorage or json error, reset board list
		recentBoards = [];
		console.log("Board history loading error", e);
	}
	recentBoards = recentBoards.filter(function (name) {
		return name !== boardName;
	});
	recentBoards.unshift(boardName);
	recentBoards = recentBoards.slice(0, 20);
	localStorage.setItem(key, JSON.stringify(recentBoards));
}