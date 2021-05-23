import database_data_type from "../objectModels/database_data_type";

const html_types = [
    {
        html_type: 'input',
        displayName: 'Input'
    },
    {
        html_type: 'multiinput',
        displayName: "Multiple input"
    },
    {
        html_type: 'select',
        displayName: "Select"
    },
    {
        html_type: 'multiselect',
        displayName: "Multiple select"
    },
    {
        html_type: 'password',
        displayName: "Password",
        force_data_type: "varchar"
    },
    {
        html_type: 'boolean',
        displayName: "Boolean",
        force_data_type: "int"
    }
];

const data_types = [
    {
        data_type: 'int',
        displayName: "Interger"
    },
    {
        data_type: 'decimal',
        displayName: "Decimal"
    },
    {
        data_type: 'varchar',
        displayName: "Varchar"
    },
    {
        data_type: 'text',
        displayName: "Text"
    },
    {
        data_type: 'html',
        displayName: "Html"
    },
    {
        data_type: 'datetime',
        displayName: "Datetime"
    }
]

const eav_entity_columns = [
    {
        column: "attribute_id",
        column_name: "ID",
        required: true,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation,
        render: ({ self, state, setState, mode }) => {
            if (mode === "CREATE") mode = false;
            if (mode === "UPDATE") mode = true;
            self.invalid_message = "";
            let isNullValue = (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) ? "null" : "";
            if (state[self.column] !== undefined && !self.f_validation(state[self.column])) {
                self.invalid_message = (
                    <span>
                        <span className="hightlight">{self.column_name}</span>
                        <span> must not be empty!</span>
                    </span>
                )
            }
            return (
                <input disabled={mode} className={isNullValue} type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "label",
        column_name: "Label",
        required: true,
        f_validation: database_data_type["NONE_EMPTY_STRING"].f_validation,
        render: ({ self, state, setState }) => {
            self.invalid_message = "";
            let isNullValue = (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) ? "null" : "";
            if (state[self.column] !== undefined && !self.f_validation(state[self.column])) {
                self.invalid_message = (
                    <span>
                        <span className="hightlight">{self.column_name}</span>
                        <span> must not be empty!</span>
                    </span>
                )
            }
            return (
                <input className={isNullValue} type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "referred_target",
        column_name: "Referred target",
        render: ({ self, state, setState }) => {
            let isNullValue = (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) ? "null" : "";
            return (
                <input className={isNullValue} type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "html_type",
        column_name: "Html type",
        required: true,
        render: ({ self, state, setState }) => {
            let isNullValue = (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) ? "null" : "";
            self.invalid_message = "";
            if (state[self.column] !== undefined && html_types.map(item => item.html_type).indexOf(state[self.column]) === -1) {
                self.invalid_message = (
                    <span>
                        <span className="hightlight">{self.column_name}</span>
                        <span> must not be empty!</span>
                    </span>
                )
            }
            return (
                <select className={isNullValue}
                    value={state.html_type || ""}
                    onChange={(event) => {
                        let force_data_type = (html_types.find(item => item.html_type === event.target.value) || {}).force_data_type;
                        if (force_data_type) {
                            state.data_type = force_data_type;
                        };
                        if (["select", "multiselect"].indexOf(event.target.value) === -1) {
                            delete state.options;
                        }
                        state[self.column] = event.target.value;
                        setState({...state})
                    }}
                >
                    <option value="">-------------------------------</option>
                    {html_types.map((item, index) => {
                        return (
                            <option
                                key={index} value={item.html_type}
                            >{item.displayName}</option>
                        )
                    })}
                </select>
            )
        }
    },
    {
        column: "data_type",
        column_name: "Data type",
        required: true,
        render: ({ self, state, setState }) => {
            let isNullValue = (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) ? "null" : "";
            self.invalid_message = "";
            if (state[self.column] !== undefined && data_types.map(item => item.data_type).indexOf(state[self.column]) === -1) {
                self.invalid_message = (
                    <span>
                        <span className="hightlight">{self.column_name}</span>
                        <span> must not be empty!</span>
                    </span>
                )
            }
            let force_data_type = (html_types.find(item => item.html_type === state.html_type) || {}).force_data_type;
            return (
                <select className={isNullValue} disabled={force_data_type ? true : false}
                    value={state.data_type || ""}
                    onChange={(event) => setState({...state, [self.column]: event.target.value})}
                >
                    <option value="">-------------------------------</option>
                    {data_types.map((item, index) => {
                        return (
                            <option
                                key={index} value={item.data_type}
                            >{item.displayName}</option>
                        )
                    })}
                </select>
            )
        }
    },
    {
        column: "validation",
        column_name: "regex validation",
        f_validation: database_data_type["REGEXP"].f_validation,
        render: ({ self, state, setState }) => {
            let isNullValue = (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) ? "null" : "";
            self.invalid_message = "";
            if (!self.f_validation(state[self.column])) {
                self.invalid_message = (
                    <span>
                        <span className="hightlight">{self.column_name}</span>
                        <span> is invalid!</span>
                    </span>
                )
            }
            return (
                <input className={isNullValue} type="text" value={state[self.column] || ""}
                    onChange={event => setState({ ...state, [self.column]: event.target.value })}
                />
            )
        }
    },
    {
        column: "unit",
        column_name: "Unit",
        render: ({ self, state, setState }) => {
            let isNullValue = (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) ? "null" : "";
            return (
                <input className={isNullValue} type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "admin_only",
        column_name: "Admin only",
        render: ({ self, state, setState }) => {
            let value = state[self.column];
            if (value === true || value == 1) { // eslint-disable-line
                value = 1;
            } else {
                value = 0;
            }
            return (
                <input type="checkbox" checked={value === 1 ? true : false}
                    onChange={event => {
                        let new_val = event.target.checked ? 1 : 0;
                        setState({ ...state, [self.column]: new_val })
                    }
                    }
                />
            )
        }
    },
    {
        column: "is_super",
        column_name: "Is super",
        render: ({ self, state, setState }) => {
            let value = state[self.column];
            if (value === true || value == 1) { // eslint-disable-line
                value = 1;
            } else {
                value = 0;
            }
            return (
                <input type="checkbox" checked={value === 1 ? true : false}
                    onChange={event => {
                        let new_val = event.target.checked ? 1 : 0;
                        setState({ ...state, [self.column]: new_val })
                    }
                    }
                />
            )
        }
    },
    {
        column: "is_system",
        column_name: "Is system",
        render: ({ self, state, setState }) => {
            let value = state[self.column];
            if (value === true || value == 1) { // eslint-disable-line
                value = 1;
            } else {
                value = 0;
            }
            return (
                <input type="checkbox" checked={value === 1 ? true : false}
                    onChange={event => {
                        let new_val = event.target.checked ? 1 : 0;
                        setState({ ...state, [self.column]: new_val })
                    }
                    }
                />
            )
        }
    }
];

export {
    eav_entity_columns
};