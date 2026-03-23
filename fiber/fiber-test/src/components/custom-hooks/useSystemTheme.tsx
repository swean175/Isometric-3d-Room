import { useEffect, useState } from "react";

export function useSystemTheme() {
	// Sprawdzamy początkowy stan systemu
	const [isDark, setIsDark] = useState(
		window.matchMedia("(prefers-color-scheme: dark)").matches,
	);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		// Funkcja aktualizująca stan po zmianie w systemie
		const handleChange = (event: MediaQueryListEvent) =>
			setIsDark(event.matches);

		// Nasłuchiwanie na zmiany (nowoczesna składnia)
		mediaQuery.addEventListener("change", handleChange);

		// Sprzątanie po odmontowaniu komponentu
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	return isDark ? "dark" : "light";
}
