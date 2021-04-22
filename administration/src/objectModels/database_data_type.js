const database_data_type = {
    "NONE_EMPTY_STRING": {
        f_convert_value: function(value) {
            if (typeof(value) === "string" || typeof(value) === "number") {
                return value.toString();
            };
            return value;
        },
        f_validation: function(value) {
            return typeof(value) === "string" && value.replace(/^\s+|\s+$/g, "").length > 0;
        }
    },
    "BOOLEAN": {
        f_convert_value: function (value) {
            // input type number still return string!!
            // using value == "0" instead of value == 0 to prevent case 0 == ""
            if (value == "1" || value === true || value === "true") return 1; // eslint-disable-line
            if (value == "0" || value === false || value === "false") return 0; // eslint-disable-line
            return value;
        },
        f_validation: function(value) {
            return value === 1 || value === 0;
        }
    },
    "NONE_NEGATIVE_INT": {
        f_convert_value: function(value) {
            if (parseInt(value) == value) { // eslint-disable-line
                return parseInt(value);
            };
            return value;
        },
        f_validation: function(value) {
            return typeof(value) === "number" && value >= 0 && value === parseInt(value);
        }
    },
    "REGEXP": {
        f_validation: function(value) {
            try {
                let regex = new RegExp(value);
                return true;
            } catch (err) {
                return false;
            }
        }
    }
}

export default database_data_type;