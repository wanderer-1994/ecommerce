const database_data_type = require("../database_data_type");

const eavCommon = {};

eavCommon.eav_columns = [
    {
        column: "attribute_id",
        valueInvalidMessage: "'attribute_id' must be number or none-empty string.",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "label",
        valueInvalidMessage: "'label' must be none-empty string.",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "referred_target",
        valueInvalidMessage: "'referred_target' must be none-empty string.",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "admin_only",
        valueInvalidMessage: "'admin_only' must be enum (0, 1).",
        validation_function: database_data_type["BOOLEAN"].f_validation
    },
    {
        column: "html_type",
        valueInvalidMessage: "'html_type' must be enum ('input', 'multiinput', 'select', 'multiselect', 'password', 'boolean').",
        validation_function: function (value) {
            return ['input', 'multiinput', 'select', 'multiselect', 'password', 'boolean'].indexOf(value) !== -1;
        }
    },
    {
        column: "data_type",
        valueInvalidMessage: "'data_type' must be enum ('int', 'decimal', 'varchar', 'text', 'html', 'datetime').",
        validation_function: function (value) {
            return ['int', 'decimal', 'varchar', 'text', 'html', 'datetime'].indexOf(value) !== -1;
        }
    },
    {
        column: "validation",
        valueInvalidMessage: "'validation' must be none-empty string",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "is_super",
        valueInvalidMessage: "'is_super' must be enum (0, 1).",
        validation_function: database_data_type["BOOLEAN"].f_validation
    },
    {
        column: "is_system",
        valueInvalidMessage: "'is_system' must be enum (0, 1).",
        validation_function: database_data_type["BOOLEAN"].f_validation
    },
    {
        column: "unit",
        valueInvalidMessage: "'unit' must be none-empty string",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "sort_order",
        valueInvalidMessage: "'sort_order' must be of type int",
        validation_function: database_data_type["POSITIVE_INT"].f_validation
    }
];

eavCommon.eav_option_columns = [
    {
        column: "attribute_id"
    },
    {
        column: "value"
    },
    {
        column: "label"
    },
    {
        column: "sort_order"
    }
];

eavCommon.eav_group_columns = [
    {
        column: "group_id",
        valueInvalidMessage: "'group_id' must be none-empty string.",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "entity_type",
        valueInvalidMessage: "'entity_type' must be none-empty string.",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "sort_order",
        valueInvalidMessage: "'sort_order' must be posotive int.",
        validation_function: database_data_type["POSITIVE_INT"].f_validation
    }
];

eavCommon.eav_group_assignment_columns = [
    {
        column: "group_id",
        valueInvalidMessage: "'group_id' must be none-empty string.",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "entity_type",
        valueInvalidMessage: "'group_id' must be none-empty string.",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "attribute_id",
        valueInvalidMessage: "'group_id' must be none-empty string.",
        validation_function: database_data_type["NONE_EMPTY_STRING"].f_validation
    },
    {
        column: "sort_order",
        valueInvalidMessage: "'sort_order' must be positive int.",
        validation_function: database_data_type["POSITIVE_INT"].f_validation
    },
]

eavCommon.all_entity_types = ["product", "category"];

module.exports = eavCommon;