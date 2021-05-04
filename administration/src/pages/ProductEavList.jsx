import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/mockApi";
import * as appFunction from "../utils/appFunction";
import * as EavModel from "../objectModels/EavModel";
import $ from "jquery";
import "../css/list.css";

const eav_columns = [
    {
        column: "attribute_id",
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
        column: "label",
        column_name: "Label",
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
        column: "referred_target",
        column_name: "Referred target",
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
        column: "admin_only",
        column_name: "Admin only",
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
        column: "html_type",
        column_name: "Html type",
        data_type: "text",
        align: "center",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        }
    },
    {
        column: "data_type",
        column_name: "Data type",
        data_type: "text",
        align: "center",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        }
    },
    {
        column: "validation",
        column_name: "Regex validation",
        data_type: "text",
        align: "center",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        }
    },
    {
        column: "is_super",
        column_name: "Is super",
        data_type: "text",
        align: "center",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        }
    },
    {
        column: "is_system",
        column_name: "Is system",
        data_type: "text",
        align: "center",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        }
    },
    {
        column: "unit",
        column_name: "Unit",
        data_type: "text",
        align: "center",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        }
    },
    // {
    //     column: "position",
    //     column_name: "Position",
    //     data_type: "text",
    //     align: "right",
    //     td_style: {
    //         width: "80px"
    //     },
    //     th_style: {
    //         width: "80px"
    //     }
    // }
];

function ProductEavList (props) {

    const [eav_list, setEavList] = useState({product_eavs: []});

    useEffect(() => {
        api.getProductEavs()
        .then(data => {
            setEavList({product_eavs: data});
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

    function changeEavAttribute ({ attribute_id, column, value }) {
        let match = (eav_list.temp || []).find(item => item.attribute_id === attribute_id);
        if (!match) {
            match = eav_list.product_eavs.find(item => item.attribute_id === attribute_id);
            match = JSON.parse(JSON.stringify(match));
            eav_list.temp = eav_list.temp ? [...eav_list.temp, match] : [match];
            match[column] = value;
        } else {
            match[column] = value;
        }
        setEavList({...eav_list});
    };

    function toggleEdit (eav_item, isOn) {
        if (!isOn) {
            eav_list.temp = (eav_list.temp || []).filter(item => item.attribute_id !== eav_item.attribute_id);
        } else {
            eav_item = JSON.parse(JSON.stringify(eav_item));
            if (!eav_list.temp) {
                eav_list.temp = [eav_item];
            } else {
                eav_list.temp.push(eav_item)
            }
        };
        setEavList({...eav_list});
    }

    async function updateEavAttribute (attribute_id, event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let match = (eav_list.temp || []).find(item => item.attribute_id === attribute_id);
        if (!match) {
            return appFunction.appAlert(true);
        };
        match = JSON.parse(JSON.stringify(match));
        delete match.options;
        let validation = EavModel.validateEavModel(match);
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
        let result = await api.updateProductEavs([match]);
        if (result && result.product_eavs && result.product_eavs[0] && result.product_eavs[0].isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Update success for attribute: </span>
                        <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                            {result.product_eavs[0].label}
                        </span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    api.getProductEavs()
                    .then(data => {
                        eav_list.temp = eav_list.temp.filter(item => item.attribute_id !== attribute_id);
                        setEavList({
                            ...eav_list, product_eavs: data
                        });
                        setTimeout(() => {
                            let target = $(".tb-row-item td.key input");
                            for (let i = 0; i < target.length; i++) {
                                if (target.eq(i).val() == attribute_id) { // eslint-disable-line
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
            let m_failure = result && result.product_eavs && result.product_eavs[0] && result.product_eavs[0] ? result.product_eavs[0].m_failure : "";
            appFunction.appAlert({
                icon: "danger",
                title: <div>Action incomplete!</div>,
                message: (
                    <div>
                        <span>Could not update: </span>
                        <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
                            {match.label}
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

    async function deleteEavAttribute (attribute_id, event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let eav_label;
        let match = eav_list.product_eavs.find(item => item.attribute_id === attribute_id);
        if (match) {
            eav_label = match.label;
        };
        appFunction.appAlert({
            icon: "info",
            title: <div>Confirm action</div>,
            message: (
                <div>
                    <span>Do you want to delete following attribute ?</span>
                    <br />
                    <span style={{color: "var(--colorDanger)", textDecoration: "underline", textAlign: "center", marginTop: "10px", display: "block"}}>
                        {eav_label} ({attribute_id})
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
                let result = await api.deleteProductEavs([attribute_id]);
                if (result && result.isSuccess) {
                    appFunction.appAlert({
                        icon: "success",
                        title: <div>Success</div>,
                        message: (
                            <div>
                                <span>Attribute: </span>
                                <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                                    {eav_label}
                                </span>
                                <span> deleted!</span>
                            </div>
                        ),
                        timeOut: 1000,
                        onTimeOut: () => {
                            api.getProductEavs()
                                .then(data => {
                                    setEavList({product_eavs: data});
                                })
                                .catch(err => {
                                    console.log(err);
                                })
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
                                    {eav_label}
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

    function renderEav ({ eav_item, index }) {
        let isOnEdit = false;
        if (eav_list.temp) {
            let match = eav_list.temp.find(item => item.attribute_id === eav_item.attribute_id);
            if (match) {
                eav_item = match;
                isOnEdit = true;
            };
        };
        return (
            <Fragment key={index} >
                <tr className={`tb-row-item ${isOnEdit ? "onEdit" : ""}`}>
                    <td className="td_input null ord"><input disabled value={index + 1} /></td>
                    {eav_columns.map((col_item, index) => {
                        let value = eav_item[col_item.column];
                        let className = "";
                        if (value === null || value === "" || value === undefined) {
                            className += " null";
                        };
                        if (col_item.column === "attribute_id") {
                            className += " key";
                        }
                        return (
                            <td style={col_item.td_style} className={`td_input ${col_item.align} ${className}`} key={index}>
                                {col_item.column === "attribute_id" ?
                                (
                                    <Link to={`/eav/product/${eav_item.attribute_id}`} target="_blank">
                                        <input
                                            disabled type={col_item.data_type} value={(value === null || value === "" || value === undefined) ? "" : value}
                                        />
                                    </Link>
                                )
                                : (
                                    <input
                                        disabled={!isOnEdit} type={col_item.data_type} value={(value === null || value === "" || value === undefined) ? "" : value}
                                        onChange={(event) => {changeEavAttribute({
                                            attribute_id: eav_item.attribute_id,
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
                            onClick={(event) => {toggleEdit(eav_item, true)}}
                        >Edit</button>
                        <button
                            tabIndex={-1} className="delete tb_button"
                            onClick={(event) => {deleteEavAttribute(eav_item.attribute_id, event)}}
                        >Delete</button>
                        <button
                            tabIndex={-1} className="cancel tb_button"
                            onClick={(event) => {toggleEdit(eav_item, false)}}
                        >Cancel</button>
                        <button
                            tabIndex={-1} className="save tb_button"
                            onClick={(event) => updateEavAttribute(eav_item.attribute_id, event)}
                        >Save</button>
                    </td>
                </tr>
            </Fragment>
        )
    };

    return (
        <div className="product-eav-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/eav/product">New Attribute</Link>
            </div>
            <div className="content">
                <table className="tb_list">
                    <thead>
                        <tr>
                            <th>ORD</th>
                            {eav_columns.map((col_item, index) => {
                                return <th key={index} style={col_item.th_style}>{col_item.column_name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {eav_list && eav_list.product_eavs ? 
                            eav_list.product_eavs.map((eav_item, index) => {
                                if (eav_item){
                                    return renderEav({ eav_item, index });
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
}

export default ProductEavList;