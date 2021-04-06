import { useState, useEffect, Fragment } from "react";
import * as api from "../api/mockApi";
import "../css/detail.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";
import * as EavModel from "../objectModels/EavModel";
import InputOrTextarea from "../components/InputOrTexarea";
import * as eavValidation from '../objectModels/eav/eavValidation';
import Clear from "@material-ui/icons/Clear";
import Add from "@material-ui/icons/Add";
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
        render: ({ self, state }) => {
            return (
                <input disabled={true} type="text" value={state[self.column] || ""} />
            )
        }
    },
    {
        column: "label",
        column_name: "Label",
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
        render: ({ self, state, setState }) => {
            let isNullValue = (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) ? "null" : "";
            return (
                <input className={isNullValue} type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
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
            if (value === true || value == 1) {
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
            if (value === true || value == 1) {
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
            if (value === true || value == 1) {
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

function ProductEavDetail (props) {

    const [ori_eav, setOriEav] = useState({});
    const [eav, setEav] = useState({});
    const [isLoaded, setIsLoaded] = useState(0);

    useEffect(() => {
        api.getProductEavs().then(product_eavs => {
            let eav = product_eavs.find(item => item.attribute_id == props.match.params.entity_id) || {};
            setEav(JSON.parse(JSON.stringify(eav)));
            setOriEav(JSON.parse(JSON.stringify(eav)));
            setIsLoaded(1);
        }).catch(err => {
            console.log(err);
        });
    }, [props.match.params.entity_id]);

    async function submitUpdateEav (event) {
        $(event.target).addClass("disabled");
        $(event.target).attr("disabled", true);
        let copy_eav = JSON.parse(JSON.stringify(eav));
        Object.keys(copy_eav).forEach(key => {
            if (copy_eav[key] === ori_eav[key] && key !== "attribute_id") {
                delete copy_eav[key];
            }
        });
        if (Array.isArray(copy_eav.options)) {
            copy_eav.options.forEach((opt_item, index) => {
                if (opt_item.option_value === null || opt_item.option_value === "" || opt_item.option_value === undefined) {
                    copy_eav.options[index] = null;
                    return;
                };
            });
            copy_eav.options = copy_eav.options.filter(item => item !== null);
            copy_eav.options.forEach((item, index) => item.sort_order = index + 1)
        };
        if (JSON.stringify(copy_eav.options) === JSON.stringify(ori_eav.options)) delete copy_eav.options;
        let validation = EavModel.validateEavModel({
            ...copy_eav,
            html_type: copy_eav.html_type || eav.html_type,
            data_type: copy_eav.data_type || eav.data_type
        });
        if (copy_eav.attribute_id === null || copy_eav.attribute_id.toString().replace(/^\s+|\s+$/g, "").length === 0 || copy_eav.attribute_id === undefined) {
            validation.isValid = false;
            validation.m_failure = `'attribute_id' must not be empty!\n\t` + (validation.m_failure || "");
        };
        if (Object.keys(copy_eav).length === 1) {
            validation.isValid = false;
            validation.m_failure = `Please make changes before save!\n\t` + (validation.m_failure || "");
            return appFunction.appAlert({
                icon: "info",
                title: <div>No changes detected</div>,
                message: <div style={{whiteSpace: "pre-line"}}>{validation.m_failure}</div>,
                timeOut: 700,
                onTimeOut: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            })
        };
        if (!validation.isValid) {
            return appFunction.appAlert({
                icon: "warning",
                title: <div>Invalid input</div>,
                message: <div style={{whiteSpace: "pre-line"}}>{validation.m_failure}</div>,
                showConfirm: true,
                submitTitle: "OK",
                onClickSubmit: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            })
        };
        console.log("calling api")
        let data = await api.updateProductEavs([copy_eav]);
        let result = data && data.product_eavs ? data.product_eavs[0] : {};
        if (result.isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Successfully update attribute : </span>
                        <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                            {eav.label}
                        </span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            });
            api.getProductEavs()
            .then(product_eavs => {
                let eav = product_eavs.find(item => item.attribute_id == props.match.params.entity_id) || {};
                setEav(JSON.parse(JSON.stringify(eav)));
                setOriEav(JSON.parse(JSON.stringify(eav)));
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            appFunction.appAlert({
                icon: "danger",
                title: <div>Action incomplete!</div>,
                message: (
                    <div>
                        <span>Could not update attribute: </span>
                        <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
                            {eav.label}
                        </span>
                        <span> !</span>
                        <div style={{marginTop: "10px", fontSize: "14px", color: "#000000", fontStyle: "italic", textDecoration: "underline"}}>
                            Error log:
                        </div>
                        <div style={{marginTop: "5px", fontSize: "12px", color: "#000000", fontStyle: "italic"}}>
                            {result.m_failure || ""}
                        </div>
                    </div>
                ),
                showConfirm: true,
                submitTitle: "OK",
                onClickSubmit: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            });
        }
    }

    return (
        <div className="product-eav-detail">
            <div className="title">
                <h3>{props.title} {eav && eav.label ? <span>: <span style={{fontStyle: "italic", color: "var(--colorSuccess)"}}>{eav.label}</span></span> : null}</h3>
                <button className="warning float large"
                    onClick={submitUpdateEav}
                >Update</button>
            </div>
            <div className="content">
                {isLoaded && !eav.attribute_id ? (
                    <div style={{marginTop: "20px", fontSize: "20px", fontStyle: "italic"}}>
                        No attribute with id <span style={{color: "var(--colorWarning)", textDecoration: "underline"}}>{props.match.params.entity_id}</span> found !!!
                    </div>
                ) : (
                    <Fragment>
                        <div className="entity-id">
                            <h4 className="section-title">Entity ID</h4>
                            {eav_entity_columns.map((col_item, index) => {
                                return (
                                    <div key={index} className="entity-column" style={{ display: "inline-block", marginRight: "10px" }}>
                                        <span className="input_tag left">
                                            <input title={col_item.column} disabled type="text" value={col_item.column_name} />
                                        </span>
                                        <span className="input_value center">
                                            {col_item.render({
                                                self: col_item,
                                                state: eav,
                                                setState: setEav
                                            })}
                                            <div className="alert_message hide">{col_item.invalid_message}</div>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        {["select", "multiselect"].indexOf(eav.html_type) !== -1 ? (
                            <Fragment>
                                <div className="entity-option">
                                    <h4 className="section-title">Options</h4>
                                    <span className="input_value left"
                                        style={{width: "calc(100% - 170px)"}}
                                    >
                                        {(function () {
                                            if (!Array.isArray(eav.options) || eav.options.length === 0) {
                                                eav.options = [{option_value: ""}];
                                            }
                                            let component_type = "input";
                                            if (eav.data_type === "text" || eav.data_type === "html") {
                                                component_type = "textarea";
                                            };
                                            return (
                                                <Fragment>
                                                    {eav.options.map((v_item, index) => {
                                                        let isNull = !v_item || v_item.option_value === null || v_item.option_value === "" || v_item.option_value === undefined;
                                                        // validation message
                                                        let invalid_message = "";
                                                        let converted_value = eavValidation.converAttributeValue({
                                                            value: v_item.option_value,
                                                            data_type: eav.data_type,
                                                            html_type: eav.html_type
                                                        });
                                                        let validation = eavValidation.validateAttributeValue({
                                                            value: converted_value,
                                                            data_type: eav.data_type,
                                                            html_type: eav.html_type,
                                                            validation: eav.validation
                                                        });
                                                        if (v_item.option_value != "" && !validation) {
                                                            invalid_message =
                                                            <span>
                                                                Option must be of type <span className="hightlight">{eav.data_type}</span>
                                                                {eav.validation ? <span><span> and match regex </span><span className="hightlight">{eav.validation}</span></span> : "" } !
                                                            </span>
                                                        }
                                                        return (
                                                            <div className="input_value" key={index}
                                                                style={{display: "block"}}
                                                            >
                                                                <InputOrTextarea className={isNull ? "null" : ""} component_type={component_type} className="multiinput_item" type="text" value={v_item.option_value || ""} 
                                                                    onChange={event => {
                                                                        eav.options[index].option_value = event.target.value;
                                                                        setEav({...eav})
                                                                    }}
                                                                    style={{width: "calc(100% - 40px)"}}
                                                                />
                                                                {eav.options.length > 1 ? (
                                                                    <Clear className="multiinput_remove" onClick={() => {
                                                                        eav.options.splice(index, 1);
                                                                        setEav({...eav});
                                                                    }} />
                                                                ): null}
                                                                <br/>
                                                                <div
                                                                    className={`alert_message ${invalid_message ? "hide" : ""}`}
                                                                    style={invalid_message ? {color: "var(--colorDanger)"} : {}}
                                                                >{invalid_message}</div>
                                                            </div>
                                                        )
                                                    })}
                                                    <Add className="multiinput_add" onClick={() => {
                                                        eav.options.push({option_value: ""});
                                                        setEav({...eav});
                                                    }} />
                                                </Fragment>
                                            )
                                        })()}
                                    </span>
                                </div>
                            </Fragment>
                        ) : null}
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default ProductEavDetail;