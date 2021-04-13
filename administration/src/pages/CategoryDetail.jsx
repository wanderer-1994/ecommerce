import { useState, useEffect, Fragment } from "react";
import * as api from "../api/mockApi";
import "../css/detail.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";
import EavAttributeRender from "../components/EavAttributeRender";
import * as CategoryModel from "../objectModels/CategoryModel";

const category_entity_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        required: true,
        render: ({ self, state, setState }) => {
            return (
                <input disabled={true} type="text" value={state[self.column] || ""} />
            )
        }
    },
    {
        column: "name",
        column_name: "Name",
        required: true,
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "parent",
        column_name: "Parent",
        render: ({ self, state, setState, parentOptions, setParentOptions }) => {
            let selected = parentOptions.find(item => item.entity_id === state.parent);
            return (
                <select
                    value={selected ? selected.entity_id : ""}
                    onChange={(event) => setState({...state, [self.column]: event.target.value})}
                >
                    <option value="">-------------------------------</option>
                    {parentOptions.map((parent_item, index) => {
                        return (
                            <option
                                key={index} value={parent_item.entity_id}
                            >{parent_item.name} ({parent_item.entity_id})</option>
                        )
                    })}
                </select>
            )
        }
    },
    {
        column: "position",
        column_name: "Position",
        f_validation: (value) => (value === "" || value === "-") || (parseInt(value) == value && parseInt(value) >= 0),
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={state[self.column] || ""}
                    onChange={event => {
                        if (!self.f_validation(event.target.value)) {
                            let invalid_message = `<span class="hightlight">${self.column_name}</span> must be non-negative number!`;
                            $(event.target).parent(".input_value").find(".alert_message").html(invalid_message);
                            $(event.target).css("color", "var(--colorDanger)");
                            $(event.target).removeClass("hide");
                        } else {
                            $(event.target).parent(".input_value").find(".alert_message").html("");
                            $(event.target).css("color", "");
                            $(event.target).addClass("hide");
                        };
                        setState({ ...state, [self.column]: event.target.value })
                    }}
                />
            )
        }
    },
    {
        column: "is_online",
        column_name: "Online",
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

const default_category = {
    entity_id: "",
    name: "",
    parent: "",
    is_online: "",
    position: "",
    attributes: []
}

function CategoryDetail (props) {

    const [ori_category, setOriCategory] = useState(JSON.parse(JSON.stringify(default_category)));
    const [category, setCategory] = useState(JSON.parse(JSON.stringify(default_category)));
    const [categoryEavs, setCategoryEavs] = useState([]);
    const [parentOptions, setParentOptions] = useState([]);
    const [isLoaded, setIsLoaded] = useState(0);

    useEffect(() => {
        let promises = [];
        promises.push(
            api.getCategories().then(data => {
                let categories = data.categories || [];
                let category = data.categories.find(item => item.entity_id == props.match.params.entity_id) || default_category;
                categories = categories.filter(item => item.entity_id !== category.entity_id && item.parent !== category.entity_id);
                setParentOptions(categories);
                setCategory(JSON.parse(JSON.stringify(category)));
                setOriCategory(JSON.parse(JSON.stringify(category)));
            }).catch(err => {
                console.log(err);
            })
        )
        promises.push(
            api.getCategoryEavs().then(category_eavs => {
                setCategoryEavs(category_eavs || []);
            }).catch(err => {
                console.log(err);
            })
        );
        Promise.all(promises).then(() => {
            setIsLoaded(1);
        })
    }, [props.match.params.entity_id]);

    async function submitUpdateCategory (event) {
        $(event.target).addClass("disabled");
        $(event.target).attr("disabled", true);
        let required_fields = category_entity_columns.filter(item => item.required === true).map(item => item.column);
        let copy_category = JSON.parse(JSON.stringify(category));
        delete copy_category.children;
        Object.keys(copy_category).forEach(key => {
            if (
                copy_category[key] === ori_category[key] &&
                required_fields.indexOf(key) === -1
            ) {
                delete copy_category[key];
            }
        });
        if (Array.isArray(copy_category.attributes)) {
            copy_category.attributes.forEach((attr_item, index) => {
                if (Array.isArray(attr_item.value)) {
                    attr_item.value = attr_item.value.filter(v_item => v_item !== null && v_item !== "" && v_item !== undefined);   
                };
                if (attr_item.value === undefined) {
                    copy_category.attributes[index] = null;
                    return;
                };
                let ori_match = (ori_category.attributes || []).find(item => item.attribute_id === attr_item.attribute_id);
                if (ori_match && (JSON.stringify(attr_item.value) === JSON.stringify(ori_match.value))) {
                    copy_category.attributes[index] = null;
                    return;
                }
                if (
                    !ori_match &&
                    (   attr_item.value === null ||
                        attr_item.value === "" ||
                        attr_item.value === undefined ||
                        attr_item.value.toString().replace(/^\s+|\s+$/g, "").length === 0
                    )
                ) {
                    copy_category.attributes[index] = null;
                    return;
                }
                let matchEav = categoryEavs.find(eav => eav.attribute_id === attr_item.attribute_id);
                if (!matchEav) {
                    copy_category.attributes[index] = null;
                } else {
                    copy_category.attributes[index] = {...matchEav, ...attr_item};
                };
            });
            copy_category.attributes = copy_category.attributes.filter(item => item !== null);
            if (copy_category.attributes.length === 0) {
                delete copy_category.attributes;
            }
        };
        let validation = CategoryModel.validateCategoryModel(copy_category);
        required_fields.forEach(column => {
                if (
                    copy_category[column] === null ||
                    copy_category[column] === "" ||
                    copy_category[column] === undefined ||
                    copy_category[column].length === 0
                ) {
                    validation.isValid = false;
                    validation.m_failure = `'${column}' must not be empty!\n\t` + (validation.m_failure || "");
                };
            })
        if (Object.keys(copy_category).length === required_fields.length) {
            let isChanged = false;
            required_fields.forEach(column => {
                if (copy_category[column] !== ori_category[column]) {
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
        let data = await api.updateCategories([copy_category]);
        let result = data && data.categories ? data.categories[0] : {};
        if (result.isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Successfully update category : </span>
                        <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                            {result.name}
                        </span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            });
            api.getCategories()
            .then(data => {
                let categories = data.categories || [];
                let category = data.categories.find(item => item.entity_id == props.match.params.entity_id) || default_category;
                categories = categories.filter(item => item.entity_id !== category.entity_id && item.parent !== category.entity_id);
                setParentOptions(categories);
                setCategory(JSON.parse(JSON.stringify(category)));
                setOriCategory(JSON.parse(JSON.stringify(category)));
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
                        <span>Could not update category: </span>
                        <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
                            {category.name}
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
        <div className="category-detail">
            <div className="title">
                <h3>{props.title}{ori_category && ori_category.name ? <span>: <span style={{fontStyle: "italic", color: "var(--colorSuccess)"}}>{ori_category.name}</span></span> : ""}</h3>
                <button className="warning float large"
                    onClick={submitUpdateCategory}
                >Update</button>
            </div>
            <div className="content">
                {isLoaded && !ori_category.entity_id ? (
                    <div style={{marginTop: "20px", fontSize: "20px", fontStyle: "italic"}}>
                        No category with id <span style={{color: "var(--colorWarning)", textDecoration: "underline"}}>{props.match.params.entity_id}</span> found !!!
                    </div>
                ) : (
                    <Fragment>
                        <div className="entity-id">
                            <h4 className="section-title">Entity ID</h4>
                            {category_entity_columns.map((col_item, index) => {
                                return (
                                    <div key={index} className="entity-column" style={{ display: "inline-block", marginRight: "10px" }}>
                                        <span className="input_tag left">
                                            <input title={col_item.column} disabled type="text" value={col_item.column_name} />
                                        </span>
                                        <span className="input_value center">
                                            {col_item.render({
                                                self: col_item,
                                                state: category,
                                                setState: setCategory,
                                                parentOptions: parentOptions,
                                                setParentOptions: setParentOptions
                                            })}
                                            <div className="alert_message hide"></div>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="entity-eav">
                            <h4 className="section-title">Attributes</h4>
                            {categoryEavs.map((eav_item, index) => {
                                let eav_value = (category.attributes || []).find(item => item.attribute_id === eav_item.attribute_id);
                                if (!eav_value) {
                                    eav_value = {
                                        attribute_id: eav_item.attribute_id
                                    };
                                    if (!Array.isArray(category.attributes)) category.attributes = [];
                                    category.attributes.push(eav_value);
                                }
                                return <EavAttributeRender key={index} eav_definition={eav_item} eav_value={eav_value} state={category} setState={setCategory} />
                            })}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default CategoryDetail;