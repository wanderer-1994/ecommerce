import { useEffect, useState, Fragment } from "react";
import * as api from "../api/mockApi";
import "../css/detail.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";
import EavAttributeRender from "../components/EavAttributeRender";
import * as CategoryModel from "../objectModels/CategoryModel";
import EavCustomRender from "./category/EavCustomRender";

const category_entity_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        required: true,
        render: ({ self, state, setState }) => {
            let isNull = false;
            if (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) isNull = true;
            return (
                <input className={isNull ? "null" : ""} type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "name",
        column_name: "Name",
        required: true,
        render: ({ self, state, setState }) => {
            let isNull = false;
            if (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) isNull = true;
            return (
                <input className={isNull ? "null" : ""} type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
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
                    className={selected ? "" : "null"}
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
            let isNull = false;
            if (state[self.column] === null || state[self.column] === "" || state[self.column] === undefined) isNull = true;
            return (
                <input className={isNull ? "null" : ""} type="text" value={state[self.column] || ""}
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
    is_online: 0,
    position: "",
    attributes: []
}

function CategoryCreate(props) {

    const [category, setCategory] = useState(JSON.parse(JSON.stringify(default_category)));
    const [categoryEavs, setCategoryEavs] = useState([]);
    const [parentOptions, setParentOptions] = useState([]);
    const [entityEavGroup, setEntityEavGroup] = useState([]);
    const [eavGroupIncluded, setEavGroupIncluded] = useState([]);

    useEffect(() => {
        api.getCategoryEavs()
            .then(category_eavs => {
                setCategoryEavs(category_eavs || []);
            })
            .catch(err => {
                console.log(err);
            });
        api.getCategories()
            .then(data => {
                let categories = data.categories || [];
                setParentOptions(categories);
            })
            .catch(err => {
                console.log(err);
            });
        api.getEavGroups("category")
            .then(data => {
                setEntityEavGroup(data.eav_groups || []);
                let included = [];
                (data.eav_groups || []).forEach(item => {
                    (item.attributes || []).forEach(attribute => {
                        included.push(attribute.attribute_id);
                    });
                });
                setEavGroupIncluded(included);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    async function submitCreateCategory (event) {
        $(event.target).addClass("disabled");
        $(event.target).attr("disabled", true);
        let copy_category = JSON.parse(JSON.stringify(category));
        delete copy_category.children;
        Object.keys(copy_category).forEach(key => {
            if (copy_category[key] === null || copy_category[key] === "" || copy_category[key] === undefined) {
                delete copy_category[key];
            }
        });
        if (Array.isArray(copy_category.attributes)) {
            copy_category.attributes.forEach((attr_item, index) => {
                if (Array.isArray(attr_item.value)) {
                    attr_item.value = attr_item.value.filter(v_item => v_item !== null && v_item !== "" && v_item !== undefined);
                }
                if (
                    attr_item.value === null ||
                    attr_item.value === "" ||
                    attr_item.value === undefined ||
                    (Array.isArray(attr_item.value) && attr_item.value.length === 0)
                ) {
                    copy_category.attributes[index] = null;
                } else {
                    let matchEav = categoryEavs.find(eav => eav.attribute_id === attr_item.attribute_id);
                    if (!matchEav) {
                        copy_category.attributes[index] = null;
                    } else {
                        copy_category.attributes[index] = {...matchEav, ...attr_item};
                    }
                }
            });
            copy_category.attributes = copy_category.attributes.filter(item => item !== null);
            if (copy_category.attributes.length === 0) {
                delete copy_category.attributes;
            }
        };
        let validation = CategoryModel.validateCategoryModel(copy_category);
        category_entity_columns
        .filter(col_item => col_item.required === true)
        .forEach(col_item => {
            if (!copy_category[col_item.column] || copy_category[col_item.column].length === 0) {
                validation.isValid = false;
                validation.m_failure = `'${col_item.column_name}' must not be empty!\n\t` + (validation.m_failure || "")
            }
        });
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
        let result = await api.createCategories([copy_category]);
        if (result && result.categories && result.categories[0] && result.categories[0].isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Successfully create category : </span>
                        <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                            {result.categories[0].name}
                        </span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    setCategory(JSON.parse(JSON.stringify(default_category)));
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            });
            api.getCategories()
            .then(data => {
                let categories = data.categories || [];
                setParentOptions(categories);
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            let m_failure = result && result.categories && result.categories[0] && result.categories[0] ? result.categories[0].m_failure : "";
            appFunction.appAlert({
                icon: "danger",
                title: <div>Action incomplete!</div>,
                message: (
                    <div>
                        <span>Could not create category: </span>
                        <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
                            {copy_category.name}
                        </span>
                        <span> !</span>
                        <div style={{marginTop: "10px", fontSize: "14px", color: "#000000", fontStyle: "italic", textDecoration: "underline"}}>
                            Error log:
                        </div>
                        <div style={{marginTop: "5px", fontSize: "12px", color: "#000000", fontStyle: "italic"}}>
                            {m_failure}
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
        <div className="category-create">
            <div className="title">
                <h3>{props.title}</h3>
                <button className="success float large"
                    onClick={submitCreateCategory}
                >Submit</button>
            </div>
            <div className="content">
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
                    <div className="section-item attributes active">
                        {entityEavGroup.map((eav_group, index) => {
                            return (
                                <Fragment key={index}>
                                    <h4 className="eav-group-title">{eav_group.group_id}</h4>
                                    {(eav_group.attributes || []).map((attribute, attr_idx) => {
                                        let eav_item = categoryEavs.find(item => item.attribute_id === attribute.attribute_id);
                                        if (!eav_item) return null;
                                        let eav_value = (category.attributes || []).find(item => item.attribute_id === eav_item.attribute_id);
                                        if (!eav_value) {
                                            eav_value = {
                                                attribute_id: eav_item.attribute_id
                                            };
                                            if (!Array.isArray(category.attributes)) category.attributes = [];
                                            category.attributes.push(eav_value);
                                        }
                                        let Component = EavAttributeRender;
                                        if (Object.keys(EavCustomRender).indexOf(eav_item.attribute_id) !== -1) {
                                            Component = EavCustomRender[eav_item.attribute_id];
                                        }
                                        return <Component key={attr_idx} eav_definition={eav_item} eav_value={eav_value} state={category} setState={setCategory} c_multiple={true} />
                                    })}
                                </Fragment>
                            )
                        })}
                        <h4 className="eav-group-title">Ungrouped attributes</h4>
                        {categoryEavs.map((eav_item, index) => {
                            if (eavGroupIncluded.indexOf(eav_item.attribute_id) !== -1) return null;
                            let eav_value = (category.attributes || []).find(item => item.attribute_id === eav_item.attribute_id);
                            if (!eav_value) {
                                eav_value = {
                                    attribute_id: eav_item.attribute_id
                                };
                                if (!Array.isArray(category.attributes)) category.attributes = [];
                                category.attributes.push(eav_value);
                            }
                            let Component = EavAttributeRender;
                            if (Object.keys(EavCustomRender).indexOf(eav_item.attribute_id) !== -1) {
                                Component = EavCustomRender[eav_item.attribute_id];
                            }
                            return <Component key={index} eav_definition={eav_item} eav_value={eav_value} state={category} setState={setCategory} c_multiple={true} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryCreate;