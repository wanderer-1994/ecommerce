import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/mockApi";
import * as appFunction from "../utils/appFunction";
import * as CategoryModel from "../objectModels/CategoryModel";
import $ from "jquery";
import "../css/list.css";

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
        data_type: "text",
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
        data_type: "text",
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
                icon: "warning",
                title: <div>Invalid input</div>,
                message: <div style={{whiteSpace: "pre-line"}}>{validation.m_failure}</div>,
                showConfirm: true,
                submitTitle: "OK",
                onClickSubmit: () => {
                    $(event.target).parent().find("button").removeClass("disabled");
                    $(event.target).parent().find("button").attr("disabled", false);
                }
            })
        };
        let result = await api.updateCategories([match]);
        if (result && result.categories && result.categories[0] && result.categories[0].isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Update success for category: </span>
                        <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                            {result.categories[0].name}
                        </span>
                    </div>
                ),
                timeOut: 1000,
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
        } else {
            let m_failure = result && result.categories && result.categories[0] && result.categories[0] ? result.categories[0].m_failure : "";
            appFunction.appAlert({
                icon: "danger",
                title: <div>Action incomplete!</div>,
                message: (
                    <div>
                        <span>Could not update: </span>
                        <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
                            {match.name}
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
                    $(event.target).parent().find("button").removeClass("disabled");
                    $(event.target).parent().find("button").attr("disabled", false);
                }
            });
        }
    };

    async function deleteCategory (entity_id, event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let category_name;
        let match = category_list.categories.find(item => item.entity_id === entity_id);
        if (match) {
            category_name = match.name;
        };
        appFunction.appAlert({
            icon: "info",
            title: <div>Confirm action</div>,
            message: (
                <div>
                    <span>Do you want to delete following category ?</span>
                    <br />
                    <span style={{color: "var(--colorDanger)", textDecoration: "underline", textAlign: "center", marginTop: "10px", display: "block"}}>
                        {category_name} ({entity_id})
                    </span>
                </div>
            ),
            showConfirm: true,
            cancelTitle: "CANCEL",
            submitTitle: "DELETE",
            onClickCancel: () => {
                $(event.target).parent().find("button").removeClass("disabled");
                $(event.target).parent().find("button").attr("disabled", false);
            },
            onClickSubmit: async () => {
                let result = await api.deleteCategories([entity_id]);
                if (result && result.isSuccess) {
                    appFunction.appAlert({
                        icon: "success",
                        title: <div>Success</div>,
                        message: (
                            <div>
                                <span>Category: </span>
                                <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                                    {category_name}
                                </span>
                                <span> deleted!</span>
                            </div>
                        ),
                        timeOut: 1000,
                        onTimeOut: () => {
                            category_list.categories = category_list.categories.filter(item => item.entity_id !== entity_id);
                            category_list.structured = CategoryModel.structurizeCategories(category_list.categories);
                            setCategoryList({...category_list});
                            $(event.target).parent().find("button").removeClass("disabled");
                            $(event.target).parent().find("button").attr("disabled", false);
                        }
                    });
                } else {
                    appFunction.appAlert({
                        icon: "danger",
                        title: <div>Action incomplete!</div>,
                        message: (
                            <div>
                                <span>Could not delete: </span>
                                <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
                                    {category_name}
                                </span>
                                <span> !</span>
                                <div style={{marginTop: "10px", fontSize: "14px", color: "#000000", fontStyle: "italic", textDecoration: "underline"}}>
                                    Error log:
                                </div>
                                <div style={{marginTop: "5px", fontSize: "12px", color: "#000000", fontStyle: "italic"}}>
                                    {result.m_failure}
                                </div>
                            </div>
                        ),
                        showConfirm: true,
                        submitTitle: "OK",
                        onClickSubmit: () => {
                            $(event.target).parent().find("button").removeClass("disabled");
                            $(event.target).parent().find("button").attr("disabled", false);
                        }
                    });
                }
            }
        });
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
                                            disabled type={col_item.data_type} value={(value === null || value === "" || value === undefined) ? "" : value}
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
                            tabIndex={-1} className="edit tb_button"
                            onClick={(event) => {toggleEdit(cat_item, true)}}
                        >Edit</button>
                        <button
                            tabIndex={-1} className="delete tb_button"
                            onClick={(event) => {deleteCategory(cat_item.entity_id, event)}}
                        >Delete</button>
                        <button
                            tabIndex={-1} className="cancel tb_button"
                            onClick={(event) => {toggleEdit(cat_item, false)}}
                        >Cancel</button>
                        <button
                            tabIndex={-1} className="save tb_button"
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