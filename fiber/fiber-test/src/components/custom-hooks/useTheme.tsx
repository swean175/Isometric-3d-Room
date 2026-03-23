export default function useTheme({ theme }: { theme: string }) {
	const root = document.documentElement;

	if (theme === "dark") {
		root.style.colorScheme = "dark";
		document.body.className = "dark-body";
		localStorage.removeItem("theme");
		console.log("dark chosen " + theme + " " + root.style.colorScheme);
	} else {
		root.style.colorScheme = theme;
		document.body.className = "light-body";
		localStorage.setItem("theme", theme);
		console.log("else chosen " + theme + " " + root.style.colorScheme);
	}

	return theme;
}
