import { useEffect } from "react";

export default function WikiHMR() {
    useEffect(() => {
        if (!import.meta.hot) return;

        const handleUpdate = () => {
            window.dispatchEvent(
                new CustomEvent("kagejs:wiki-update")
            );
        };

        import.meta.hot.on(
            "kagejs:wiki-update",
            handleUpdate
        );

        return () => {
            import.meta.hot?.off(
                "kagejs:wiki-update",
                handleUpdate
            );
        };
    }, []);

    return null;
}
