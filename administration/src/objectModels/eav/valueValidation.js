const data_type_int = ['int', 'datetime'];
const data_type_decimal = ['decimal'];
const data_type_text = ['varchar', 'text', 'html'];

// convert to appropriate data type since html input always returns string
function convertValue ({ value, data_type, html_type }) {
    switch (html_type) {
        case "boolean":
            if (value == "0" || value === false) return 0;
            if (value == "1" || value === true) return 1;
            return value;
        case "password":
            if (typeof(value) === "string" || typeof(value) === "number") return value.toString();
            return value;
        case "multiselect":
        case "multiinput":
            if (!Array.isArray(value)) {
                return value;
            };
            value.forEach((v_item, index) => {
                if (data_type_int.indexOf(data_type) !== -1 && parseInt(v_item) == v_item) {
                    value[index] = parseInt(v_item);
                };
                if (data_type_decimal.indexOf(data_type) !== -1 && parseFloat(v_item) == v_item) {
                    value[index] = parseFloat(v_item);
                };
                if (data_type_text.indexOf(data_type) !== -1 && (typeof(v_item) === "number" || typeof(v_item) === "string")) {
                    value[index] = v_item.toString();
                }
            });
            return value;
        default:
            if (data_type_int.indexOf(data_type) !== -1 && parseInt(value) == value) {
                return parseInt(value);
            };
            if (data_type_decimal.indexOf(data_type) !== -1 && parseFloat(value) == value) {
                return parseFloat(value);
            };
            if (data_type_text.indexOf(data_type) !== -1 && (typeof(value) === "number" || typeof(value) === "string")) {
                return value.toString();
            }
            return value;
    }
}

function validateValue ({ value, data_type, html_type, validation }) {
    if (validation) {
        let regex = new RegExp(validation);
        if (!regex.test(value.toString())) return false;
    }
    if (html_type === "boolean") {
        return value === 1 || value === 0;
    };
    if (html_type === "password") {
        return typeof(value) === "string";
    }
    if (data_type_int.indexOf(data_type) !== -1) {
        return typeof(value) === "number" && value === parseInt(value);
    };
    if (data_type_decimal.indexOf(data_type) !== -1) {
        return typeof(value) === "number";
    };
    if (data_type_text.indexOf(data_type) !== -1) {
        return typeof(value) === "string";
    };
    // if no data_type specified, always return true
    return true;
}

export {
    convertValue,
    validateValue
}