import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/mockApi";
import * as appFunction from "../utils/appFunction";
import * as CategoryModel from "../objectModels/CategoryModel";
import $ from "jquery";

const category_entity_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        data_type: "text",
        align: "left",
        td_style: {
            minWidth: "70px"
        },
        th_style: {
            minWidth: "70px"
        }
    },
    {
        column: "name",
        column_name: "Name",
        data_type: "text",
        align: "left",
        td_style: {
            minWidth: "100px"
        },
        th_style: {
            minWidth: "100px"
        }
    },
    {
        column: "parent",
        column_name: "Parent",
        data_type: "text",
        align: "left",
        td_style: {
            minWidth: "100px"
        },
        th_style: {
            minWidth: "100px"
        }
    },
    {
        column: "is_online",
        column_name: "Online",
        data_type: "number",
        align: "center",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        },
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
        align: "right",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        }
    }
];

const thead_style = {
    backgroundColor: "#cdcdcd",
    height: "35px"
};

const tr_style = {
    height: "35px"
};

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

    function blinkRow (target) {
        $(target).addClass("hightlight");
        setTimeout (() => {
            $(target).removeClass("hightlight");
        }, 100)
    }

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

    function toggleEdit (cat_item, isOn) {
        if (!isOn) {
            category_list.temp = category_list.temp.filter(item => item.entity_id !== cat_item.entity_id);
        } else {
            cat_item = JSON.parse(JSON.stringify(cat_item));
            if (!category_list.temp) {
                category_list.temp = [cat_item];
            } else {
                category_list.temp.push(cat_item)
            }
        };
        setCategoryList({...category_list});
    }

    async function updateCategory (entity_id, event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let match = (category_list.temp || []).find(item => item.entity_id === entity_id);
        if (!match) {
            return appFunction.appAlert(true);
        };
        match = JSON.parse(JSON.stringify(match));
        delete match.children;
        delete match.attributes;
        let validation = CategoryModel.validateCategoryModel(match);
        if (!validation.isValid) {
            return appFunction.appAlert({
                message: validation.m_failure
            })
        };
        let result = await api.updateCategories([match]);
        if (result && result.categories && result.categories[0] && result.categories[0].isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: <div style={{color: "#ababab"}}>{`Update success for category: ${result.categories[0].name}`}</div>,
                showConfirm: true,
                cancelTitle: "Cancel",
                submitTitle: "Submit",
                // timeOut: 200,
                onTimeOut: () => {
                    api.getCategories()
                    .then(data => {
                        category_list.temp = category_list.temp.filter(item => item.entity_id !== entity_id);
                        setCategoryList({
                            ...category_list, ...data
                        });
                        setTimeout(() => {
                            let target = $(".tb-row-item td.key input");
                            for (let i = 0; i < target.length; i++) {
                                if (target.eq(i).val() == entity_id) { // eslint-disable-line
                                    target = target.eq(i).parents(".tb-row-item")[0];
                                    break;
                                };
                            };
                            blinkRow(target);
                        }, 50);
                        $(event.target).parent().find("button").removeClass("disabled");
                        $(event.target).parent().find("button").attr("disabled", false);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            });
        }
    };

    async function deleteCategory (entity_id, event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let result = await api.deleteCategories([entity_id]);
        if (result && result.isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div style={{color: "red"}}>Success</div>,
                message: <div style={{color: "#ababab"}}>{`Delete success for category: ${entity_id}`}</div>,
                timeOut: 200,
                onTimeOut: () => {
                    api.getCategories()
                    .then(data => {
                        category_list.temp = category_list.temp.filter(item => item.entity_id !== entity_id);
                        setCategoryList({
                            ...category_list, ...data
                        });
                        setTimeout(() => {
                            let target = $(".tb-row-item td.key input");
                            for (let i = 0; i < target.length; i++) {
                                if (target.eq(i).val() == entity_id) { // eslint-disable-line
                                    target = target.eq(i).parents(".tb-row-item")[0];
                                    break;
                                };
                            };
                            blinkRow(target);
                        }, 50);
                        $(event.target).parent().find("button").removeClass("disabled");
                        $(event.target).parent().find("button").attr("disabled", false);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            });
        }
    }

    function renderCategory ({cat_item, index, level}) {
        let isOnEdit = false;
        if (category_list.temp) {
            let match = category_list.temp.find(item => item.entity_id === cat_item.entity_id);
            if (match) {
                cat_item = match;
                isOnEdit = true;
            };
        };
        return (
            <Fragment key={index} >
                <tr className={`tb-row-item ${isOnEdit ? "onEdit" : ""}`}
                    style={tr_style}
                >
                    <td className="td_input null ord"><input disabled value={++total} /></td>
                    <td className="td_input null ord" style={{"--paddingleft": `${level * 10}px`}}>
                        <input disabled value={level + 1} />
                    </td>
                    {category_entity_columns.map((col_item, index) => {
                        let value = cat_item[col_item.column];
                        let className = "";
                        if (value === null || value === "" || value === undefined) {
                            className += " null";
                        };
                        if (col_item.column === "entity_id") {
                            className += " key";
                        }
                        return (
                            <td style={col_item.td_style} className={`td_input ${col_item.align} ${className}`} key={index}>
                                {col_item.column === "entity_id" ?
                                (
                                    <Link to={`/category/${cat_item.entity_id}`} target="_blank">
                                        <input
                                            disabled={!isOnEdit} type={col_item.data_type} value={(value === null || value === "" || value === undefined) ? "" : value}
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
                                        disabled={!isOnEdit} type={col_item.data_type} value={(value === null || value === "" || value === undefined) ? "" : value}
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
                            onClick={(event) => {toggleEdit(cat_item, true)}}
                        >Edit</button>
                        <button
                            tabIndex={-1} className="delete button"
                            onClick={(event) => {deleteCategory(cat_item.entity_id, event)}}
                        >Delete</button>
                        <button
                            tabIndex={-1} className="cancel button"
                            onClick={(event) => {toggleEdit(cat_item, false)}}
                        >Cancel</button>
                        <button
                            tabIndex={-1} className="save button"
                            onClick={(event) => updateCategory(cat_item.entity_id, event)}
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
                        <tr style={thead_style}>
                            <th>ORD</th>
                            <th>LEVEL</th>
                            {category_entity_columns.map((col_item, index) => {
                                return <th key={index} style={col_item.th_style}>{col_item.column_name}</th>
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

export default CategoryList;