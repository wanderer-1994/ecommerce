import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/mockApi";
import $ from "jquery";
import * as appFunction from "../utils/appFunction";
import CategoryModel from "../objectModels/CategoryModel";

const category_entity_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        data_type: "text",
        align: "left"
    },
    {
        column: "name",
        column_name: "Name",
        data_type: "text",
        align: "left"
    },
    {
        column: "parent",
        column_name: "Parent",
        data_type: "text",
        align: "left"
    },
    {
        column: "is_online",
        column_name: "Online",
        data_type: "number",
        align: "center",
        f_convert_value: value => {
            if (value === 1 || value === true) return 1;
            if (value === 0 || value === false) return 0;
            return value;
        }
    },
    {
        column: "position",
        column_name: "Position",
        data_type: "number",
        align: "right"
    }
]

function CategoryList (props) {
    const [category_list, setCategoryList] = useState({});
    useEffect(() => {
        api.getCategories()
        .then(data => {
            setCategoryList(data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    function changeCategoryEntity ({ entity_id, column, value }) {
        let match = (category_list.temp || []).find(item => item.entity_id === entity_id);
        if (!match) {
            match = category_list.categories.find(item => item.entity_id === entity_id);
            match = JSON.parse(JSON.stringify(match));
            category_list.temp = category_list.temp ? [...category_list.temp, match] : [match];
            match[column] = value;
        } else {
            match[column] = value;
        }
        setCategoryList({...category_list, temp: category_list.temp});
    };

    function cancelEdit (event, entity_id) {
        let match = (category_list.temp || []).find(item => item.entity_id === entity_id);
        if (match) {
            category_list.temp = category_list.temp.filter(item => item !== match);
            setCategoryList({...category_list, temp: category_list.temp});
        }
        toggleEdit(event, false);
    }

    async function saveCategory (entity_id) {
        let match = (category_list.temp || []).find(item => item.entity_id === entity_id);
        if (!match) {
            return appFunction.appAlert(true);
        };
        match = JSON.parse(JSON.stringify(match));
        delete match.attributes;
        let validation = CategoryModel.validateCategoryModel(match);
    };

    function renderCategory ({cat_item, index, level}) {
        if (category_list.temp) {
            let match = category_list.temp.find(item => item.entity_id === cat_item.entity_id);
            if (match) {
                cat_item = match;
            };
        }
        return (
            <Fragment key={index} >
                <tr className="tb-row-item protected">
                    <td className="td_input null ord"><input disabled value={++total} /></td>
                    <td className="td_input null ord" style={{"--paddingleft": `${level * 10}px`}}>
                        <input disabled value={level + 1} />
                    </td>
                    {category_entity_columns.map((col_item, index) => {
                        let value = cat_item[col_item.column];
                        let className = "";
                        if (value === null || value === "" || value === undefined) {
                            className += " null";
                        }
                        if (col_item.column !== "entity_id") {
                            className += " editable";
                        };
                        return (
                            <td className={`td_input ${col_item.align} ${className}`} key={index}>
                                {col_item.column === "entity_id" ?
                                (
                                    <Link to={`/category/${cat_item.entity_id}`} target="_blank">
                                        <input
                                            disabled={true} type={col_item.data_type} value={value || ""}
                                            onChange={(event) => {changeCategoryEntity({
                                                entity_id: cat_item.entity_id,
                                                column: col_item.column,
                                                value: event.target.value
                                            })}}
                                        />
                                    </Link>
                                )
                                : (
                                    <input
                                        disabled={true} type={col_item.data_type} value={value || ""}
                                        onChange={(event) => {changeCategoryEntity({
                                            entity_id: cat_item.entity_id,
                                            column: col_item.column,
                                            value: event.target.value
                                        })}}
                                    />
                                )}
                            </td>
                        )
                    })}
                    <td className="td_action">
                        <button
                            tabIndex={-1} className="edit button"
                            onClick={(event) => {toggleEdit(event, true)}}
                        >Edit</button>
                        <button
                            tabIndex={-1} className="cancel button"
                            onClick={(event) => {cancelEdit(event, cat_item.entity_id)}}
                        >Cancel</button>
                        <button
                            tabIndex={-1} className="save button"
                            onClick={() => saveCategory(cat_item.entity_id)}
                        >Save</button>
                    </td>
                </tr>
                {cat_item.children ?
                    cat_item.children.map((child_item, index) => {
                        if (child_item) {
                            return renderCategory({
                                cat_item: child_item,
                                index: index,
                                level: level + 1
                            });
                        } else {
                            return null
                        }
                    })
                : null}
            </Fragment>
        )
    };

    let total = 0;

    return (
        <div className="category-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/category">New Category</Link>
            </div>
            <div className="content">
                <table>
                    <thead>
                        <tr>
                            <th>ORD</th>
                            <th>LEVEL</th>
                            {category_entity_columns.map((col_item, index) => {
                                return <th key={index}>{col_item.column_name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {category_list && category_list.structured ? 
                            category_list.structured.map((cat_item, index) => {
                                let level = 0;
                                if (cat_item){
                                    return renderCategory({ cat_item, index, level });
                                } else {
                                    return null;
                                }
                            })
                        : null}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

function toggleEdit (event, isOn) {
    if (isOn) {
        $(event.target).parents("tr").eq(0).addClass("onEdit");
        $(event.target).parents("tr").eq(0).find(".editable input").attr("disabled", false);
    } else {
        $(event.target).parents("tr").eq(0).removeClass("onEdit");
        $(event.target).parents("tr").eq(0).find(".editable input").attr("disabled", true);
    }
}

export default CategoryList;