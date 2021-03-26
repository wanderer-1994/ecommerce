function sortEavByPosition (eavs) {
    eavs.sort((a, b) => {
        if (typeof(a.position) !== "number" && typeof(b.position) !== "number") {
            return 0;
        };
        if (typeof(a.position) === "number" && typeof(b.position) === "number") {
            return a.position - b.position;
        };
        if (typeof(a.position) === "number") return 0;
        if (typeof(b.position) === "number") return 1;
        return 0;
    });
    return eavs;
}

export {
    sortEavByPosition
}