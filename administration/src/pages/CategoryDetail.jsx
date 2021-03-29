import { useState, useEffect } from "react";
import * as api from "../api/mockApi";
import "../css/detail.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";
import EavRender from "../components/EavRender";
import * as CategoryModel from "../objectModels/CategoryModel";

const category_entity_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        required: true,
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
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
    console.log(props.match.params.entity_id);

    const [category, setCategory] = useState(default_category);
    const [categoryEavs, setCategoryEavs] = useState([]);
    const [parentOptions, setParentOptions] = useState([]);

    useEffect(() => {
        api.getCategories()
            .then(data => {
                let categories = data.categories || [];
                setParentOptions(categories);
                let category = data.categories.find(item => item.entity_id == props.match.params.entity_id);
                if (!category) {
                    category = default_category
                } else {
                    category = JSON.parse(JSON.stringify(category));
                };
                setParentOptions(categories);
                setCategory(category);
            })
            .catch(err => {
                console.log(err);
            })
        api.getCategoryEavs()
            .then(category_eavs => {
                setCategoryEavs(category_eavs || []);
            })
            .catch(err => {
                console.log(err);
            });
    }, [props.match.params.entity_id]);

    return (
        <div className="category-detail">
            <div className="title">
                <h3>{props.title}{category && category.name ? <span>: <span style={{fontStyle: "italic", color: "var(--colorSuccess)"}}>{category.name}</span></span> : ""}</h3>
                <button className="warning float large"
                    onClick={() => {}}
                >Submit</button>
            </div>
            <div className="content">
                <div className="entity-id">
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
                </div>
            </div>
        </div>
    )
}

export default CategoryDetail;