// attribute_id, label, referred_target, admin_only, html_type, data_type, vaidation, is_super, is_system, unit
import database_data_type from "./database_data_type";
import * as valueValidation from "./eav/valueValidation";
import utility from "../utils/utility";
const eav_columns = [
    {
        column: "attribute_id",
        valueInvalidMessage: `'attribute_id' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "label",
        valueInvalidMessage: `'label' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "referred_target",
        valueInvalidMessage: `'label' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "admin_only",
        valueInvalidMessage: `'label' must be none-empty string`,
        f_convert_value: database_data_type["BOOLEAN"].f_convert_value,
        f_validation: database_data_type["BOOLEAN"].f_validation
    },
    {
        column: "html_type",
        valueInvalidMessage: `'label' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: function (value) {
            return ['input', 'multiinput', 'select', 'multiselect', 'password', 'boolean'].indexOf(value) !== -1;
        }
    },
    {
        column: "data_type",
        valueInvalidMessage: `'label' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: function(value) {
            return ['int', 'decimal', 'varchar', 'text', 'html', 'datetime'].indexOf(value) !== -1;
        }
    },
    {
        column: "validation",
        valueInvalidMessage: `'label' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "is_super",
        valueInvalidMessage: `'label' must be none-empty string`,
        f_convert_value: database_data_type["BOOLEAN"].f_convert_value,
        f_validation: database_data_type["BOOLEAN"].f_validation
    },
    {
        column: "is_system",
        valueInvalidMessage: `'label' must be none-empty string`,
        f_convert_value: database_data_type["BOOLEAN"].f_convert_value,
        f_validation: database_data_type["BOOLEAN"].f_validation
    },
    {
        column: "unit",
        valueInvalidMessage: `'label' must be none-empty string`,
        f_convert_value: database_data_type["NONE_EMPTY_STRING"].f_convert_value,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation
    }
]

const option_columns = [
    {
        column: "option_value",
        f_convert_value: valueValidation.convertValue,
        f_validation: ({ value, data_type, html_type, validation, self }) => {
            self.valueInvalidMessage = "";
            if (value === null || value === "" || value === undefined) return true;
            if (!valueValidation.validateValue({ value, data_type, html_type, validation })) {
                self.valueInvalidMessage += `\n\t invalid option_value '${value}' of type '${data_type}'${validation ? ` & validation '${validation}'` : ""}.`;
                return false;
            };
            return true;
        },
        valueInvalidMessage: ""
    },
    {
        column: "label",
    },
    {
        column: "sort_order",
        f_convert_value: ({ value }) => database_data_type["POSITIVE_INT"].f_convert_value(value),
        f_validation: ({ value }) => database_data_type["POSITIVE_INT"].f_validation(value),
        valueInvalidMessage: "'sort_order' must be positive or left empty!"
    }
]

function validateEavModel (eav) {
    let isValid = true;
    let m_failure = "";
    eav_columns.forEach(col_item => {
        switch (eav[col_item.column]) {
            case undefined:
                delete eav[col_item.column];
                break;
            case null:
            case "":
                break;
            default:
                if (col_item.f_convert_value) {
                    eav[col_item.column] = col_item.f_convert_value(eav[col_item.column]);
                };
                if (!col_item.f_validation(eav[col_item.column])) {
                    isValid = false;
                    m_failure += `\n\t Invalid entity property: ${col_item.valueInvalidMessage}.`
                }
                break;
        };
    });

    switch (eav.options) {
        case undefined:
            delete eav.options;
            break;
        case null:
        case "":
            break;
        default:
            if (!Array.isArray(eav.options)) {
                isValid = false;
                m_failure += `\n\t 'options' must be an array containing option items.`;
                break;
            };
            eav.options.forEach(option_item => {
                if (utility.isValueEmpty(option_item.option_value)) {
                    isValid = false;
                    m_failure += "Invalid option: 'option_value' must not be empty.";
                    return;
                };
                if (["multiselect", "select"].indexOf(eav.html_type) === -1) {
                    isValid = false;
                    m_failure += "'options' only valid for html_types select|multiselect."
                    return;
                }
                option_columns.forEach(col_item => {
                    switch (option_item[col_item.column]) {
                        case null:
                        case "":
                        case undefined:
                            break;
                        default:
                            if (col_item.f_convert_value) {
                                option_item[col_item.column] = col_item.f_convert_value({
                                    value: option_item[col_item.column],
                                    data_type: eav.data_type,
                                    html_type: eav.html_type
                                });
                            };
                            if (col_item.f_validation && !col_item.f_validation({
                                value: option_item[col_item.column],
                                html_type: eav.html_type,
                                data_type: eav.data_type,
                                validation: eav.validation,
                                self: col_item
                            })) {
                                isValid = false;
                                m_failure += `\n\t ${col_item.valueInvalidMessage}`;
                            };
                            break;
                    }
                })
            })
            break;
    };

    return {
        isValid: isValid,
        m_failure: m_failure
    }
}

export {
    validateEavModel
}