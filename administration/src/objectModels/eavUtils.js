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
    eavs.forEach(item => {
        if (item.options) {
            item.options.sort((a, b) => {
                if (!a.sort_order && !b.sort_order) return 0;
                if (a.sort_order && b.sort_order) return parseInt(a.sort_order) - parseInt(b.sort_order);
                if (a.sort_order) return 0;
                return 1;
            })
        }
    })
    return eavs;
}

export {
    sortEavByPosition
}