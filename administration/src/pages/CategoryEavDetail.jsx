import { useState, useEffect, Fragment } from "react";
import * as api from "../api/mockApi";
import "../css/detail.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";
import * as EavModel from "../objectModels/EavModel";

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
        displayName: "Password"
    },
    {
        html_type: 'boolean',
        displayName: "Boolean"
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
        render: ({ self, state, setState }) => {
            return (
                <input disabled={true} type="text" value={state[self.column] || ""} />
            )
        }
    },
    {
        column: "label",
        column_name: "Label",
        required: true,
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "referred_target",
        column_name: "Referred target",
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "html_type",
        column_name: "Html type",
        render: ({ self, state, setState }) => {
            return (
                <select
                    value={state.html_type || ""}
                    onChange={(event) => setState({...state, [self.column]: event.target.value})}
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
            return (
                <select
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
            return (
                <input type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "unit",
        column_name: "Unit",
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "admin_only",
        column_name: "Admin only",
        f_validation: (value) => (value === "" || value === "-") || (parseInt(value) == value && parseInt(value) >= 0),
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

function CategoryEavDetail (props) {

    const [ori_eav, setOriEav] = useState({});
    const [eav, setEav] = useState({});
    const [eav_list, setEavList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(0);

    useEffect(() => {
        api.getCategoryEavs().then(category_eavs => {
            let eav = category_eavs.find(item => item.attribute_id == props.match.params.entity_id) || {};
            eav = JSON.parse(JSON.stringify(eav));
            setEavList(category_eavs || []);
            setEav(eav);
            setOriEav(eav);
            setIsLoaded(1);
        }).catch(err => {
            console.log(err);
        });
    }, [props.match.params.entity_id]);

    async function submitUpdateEav (event) {
        $(event.target).addClass("disabled");
        $(event.target).attr("disabled", true);
        let required_fields = eav_entity_columns.filter(item => item.required === true).map(item => item.column);
        let copy_eav = JSON.parse(JSON.stringify(eav));
        Object.keys(copy_eav).forEach(key => {
            if (
                copy_eav[key] === ori_eav[key] &&
                required_fields.indexOf(key) === -1
            ) {
                delete copy_eav[key];
            }
        });
        if (Array.isArray(copy_eav.options)) {
            copy_eav.options.forEach((option_item, index) => {
                if (option_item.value === null || option_item.value === "" || option_item.value === undefined) {
                    copy_eav.options[index] = null;
                    return;
                };
            });
            copy_eav.options = copy_eav.options.filter(item => item !== null);
            if (copy_eav.options.length === 0) {
                delete copy_eav.options;
            }
        };
        let validation = EavModel.validateEavModel(copy_eav);
        required_fields.forEach(column => {
                if (
                    copy_eav[column] === null ||
                    copy_eav[column] === "" ||
                    copy_eav[column] === undefined ||
                    copy_eav[column].toString().replace(/^\s+|\s+$/g, "").length === 0
                ) {
                    validation.isValid = false;
                    validation.m_failure = `'${column}' must not be empty!\n\t` + (validation.m_failure || "");
                };
            });
        if (Object.keys(copy_eav).length === required_fields.length) {
            let isChanged = false;
            required_fields.forEach(column => {
                if (copy_eav[column] !== ori_eav[column]) {
                    isChanged = true;
                }
            });
            if (!isChanged) {
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
            }
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
        let data = await api.updateCategoryEavs([copy_eav]);
        let result = data && data.category_eavs ? data.category_eavs[0] : {};
        if (result.isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Successfully update attribute : </span>
                        <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                            {result.label}
                        </span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            });
            api.getCategoryEavs()
            .then(data => {
                let category_eavs = data.category_eavs || [];
                let eav = data.category_eavs.find(item => item.attribute_id == props.match.params.attribute_id) || {};
                setEavList(category_eavs);
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
        <div className="category-eav-detail">
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
                                            <div className="alert_message hide"></div>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        {/* <div className="entity-option">
                            {categoryEavs.map((eav_item, index) => {
                                let eav_value = (category.attributes || []).find(item => item.attribute_id === eav_item.attribute_id);
                                if (!eav_value) {
                                    eav_value = {
                                        attribute_id: eav_item.attribute_id
                                    };
                                    if (!Array.isArray(category.attributes)) category.attributes = [];
                                    category.attributes.push(eav_value);
                                }
                                return <EavRender key={index} eav_definition={eav_item} eav_value={eav_value} state={category} setState={setCategory} />
                            })}
                        </div> */}
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default CategoryEavDetail;