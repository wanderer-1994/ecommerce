import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/mockApi";
import * as appFunction from "../utils/appFunction";
import * as ProductModel from "../objectModels/ProductModel";
import $ from "jquery";
import "../css/list.css";
import queryString from "query-string";
import Pagination from "../components/Pagination";

const product_entity_columns = [
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
        },
        render: ({ self, prod_item, index, isNull }) => {
            return (
                <td style={self.td_style} className={`td_input ${self.align} key ${isNull}`} key={index}>
                    <Link to={`/product/${prod_item.entity_id}`} target="_blank">
                        <input disabled type={self.data_type} value={prod_item[self.column] || ""} />
                    </Link>
                </td>
            )
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
        },
        render: ({ self, prod_item, index, isNull, isOnEdit, changeProductEntity }) => {
            return (
                <td style={self.td_style} className={`td_input ${self.align} ${isNull}`} key={index}>
                    <input
                        disabled={!isOnEdit} type={self.data_type} value={prod_item[self.column] || ""}
                        onChange={(event) => {changeProductEntity({
                            entity_id: prod_item.entity_id,
                            column: self.column,
                            value: event.target.value
                        })}}
                    />
                </td>
            )
        }
    },
    {
        column: "type_id",
        column_name: "Product type",
        data_type: "text",
        align: "right",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        },
        render: ({ self, prod_item, index, isNull, isOnEdit, changeProductEntity }) => {
            return (
                <td style={self.td_style} className={`td_input ${self.align} ${isNull}`} key={index}>
                    <input
                        disabled={!isOnEdit} type={self.data_type} value={prod_item[self.column] || ""}
                        onChange={(event) => {changeProductEntity({
                            entity_id: prod_item.entity_id,
                            column: self.column,
                            value: event.target.value
                        })}}
                    />
                </td>
            )
        }
    },
    {
        column: "parent",
        column_name: "Parent",
        data_type: "text",
        align: "right",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        },
        render: ({ self, prod_item, index, isNull, isOnEdit, changeProductEntity }) => {
            return (
                <td style={self.td_style} className={`td_input ${self.align} ${isNull}`} key={index}>
                    <input
                        disabled={!isOnEdit} type={self.data_type} value={prod_item[self.column] || ""}
                        onChange={(event) => {changeProductEntity({
                            entity_id: prod_item.entity_id,
                            column: self.column,
                            value: event.target.value
                        })}}
                    />
                </td>
            )
        }
    },
    {
        column: "created_at",
        column_name: "Created at",
        required: true,
        data_type: "text",
        align: "right",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        },
        render: ({ self, prod_item, index, isNull, isOnEdit, changeProductEntity }) => {
            let value = "";
            if (typeof(prod_item[self.column]) === "number") {
                let timezoneoffset = (new Date()).getTimezoneOffset(); // time zone offset is in minute
                let date = new Date(prod_item[self.column] - timezoneoffset * 60 * 1000);
                value = date.toISOString().replace(/:\S{7}$/g, "");
            };
            return (
                <td style={self.td_style} className={`td_input ${self.align} ${isNull}`} key={index}>
                    <input type="datetime-local" style={{overflow: "hidden"}}
                        disabled value={value}
                        onChange={(event) => {
                            let new_value = (new Date(event.target.value)).getTime();
                            changeProductEntity({
                                entity_id: prod_item.entity_id,
                                column: self.column,
                                value: new_value
                            })
                        }}
                    />
                </td>
            )
        }
    },
    {
        column: "updated_at",
        column_name: "Last update",
        required: true,
        data_type: "text",
        align: "right",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        },
        render: ({ self, prod_item, index, isNull, isOnEdit, changeProductEntity }) => {
            let value = "";
            if (typeof(prod_item[self.column]) === "number") {
                let timezoneoffset = (new Date()).getTimezoneOffset(); // time zone offset is in minute
                let date = new Date(prod_item[self.column] - timezoneoffset * 60 * 1000);
                value = date.toISOString().replace(/:\S{7}$/g, "");
            };
            return (
                <td style={self.td_style} className={`td_input ${self.align} ${isNull}`} key={index}>
                    <input type="datetime-local" style={{overflow: "hidden"}}
                        disabled value={value}
                        onChange={(event) => {
                            let new_value = (new Date(event.target.value)).getTime();
                            changeProductEntity({
                                entity_id: prod_item.entity_id,
                                column: self.column,
                                value: new_value
                            })
                        }}
                    />
                </td>
            )
        }
    }
];

const default_pzise = 15;

function ProductList (props) {

    let [ori_product_list, setOriProductList] = useState([]);
    let [product_list, setProductList] = useState([]);
    let [product_edit, setProductEdit] = useState([]);
    let [pagination, setPagination] = useState({
        totalPages: null,
        currentPage: null,
        psize: null,
        totalFound: null
    });

    useEffect(() => {
        let query = queryString.parse(props.location.search);
        query.page = parseInt(query.page) == query.page && parseInt(query.page) > 0 ? parseInt(query.page) : 1;
        query.psize = parseInt(query.psize) == query.psize && parseInt(query.psize) > 0 ? parseInt(query.psize) : default_pzise;
        api.getProductEntityOnly({
            page: query.page,
            psize: query.psize
        })
            .then(data => {
                setProductList(JSON.parse(JSON.stringify(data.products)));
                setOriProductList(JSON.parse(JSON.stringify(data.products)));
                setPagination({
                    totalPages: data.totalPages,
                    currentPage: data.currentPage,
                    psize: data.psize,
                    totalFound: data.totalFound
                })
            })
            .catch(err => {
                console.log(err);
            })
    }, [props.location.search]);

    function blinkRow (target) {
        $(target).addClass("hightlight");
        setTimeout (() => {
            $(target).removeClass("hightlight");
        }, 100)
    }

    function changeProductEntity ({ entity_id, column, value }) {
        let match = product_list.find(item => item.entity_id === entity_id);
        match[column] = value;
        setProductList([...product_list]);
    };

    function toggleEdit (prod_item, isOn) {
        if (!isOn) {
            product_edit = product_edit.filter(item => item !== prod_item.entity_id);
            let match = product_list.find(item => item.entity_id === prod_item.entity_id);
            let ori_match = ori_product_list.find(item => item.entity_id === prod_item.entity_id);
            product_list.splice(product_list.indexOf(match), 1, JSON.parse(JSON.stringify(ori_match)));
            setProductList([...product_list]);
        } else {
            product_edit.push(prod_item.entity_id);
        };
        setProductEdit([...product_edit]);
    }

    async function updateProduct (entity_id, event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let match = product_list.find(item => item.entity_id === entity_id);
        match = JSON.parse(JSON.stringify(match));
        let ori_match = ori_product_list.find(item => item.entity_id === entity_id);
        Object.keys(match).forEach(key => {
            if (
                match[key] === ori_match[key] &&
                key !== "entity_id"
            ) {
                delete match[key];
            }
        });
        if ("name" in match) {
            match.attributes = match.attributes || [];
            match.attributes.push({
                attribute_id: "name",
                value: match.name,
                data_type: "varchar",
                html_type: "input"
            });
            delete match.name;
        }
        let validation = ProductModel.validateProductModel(match);
        if (! "entity_id" in match) {
            validation.isValid = false;
            validation.m_failure = `No 'entity_id' specified!\n\t` + (validation.m_failure || "");
        }
        if (Object.keys(match).length === 1) {
            return appFunction.appAlert({
                icon: "info",
                title: <div>No changes detected!</div>,
                message: <div style={{whiteSpace: "pre-line"}}>Please make changes before save!</div>,
                showConfirm: true,
                submitTitle: "OK",
                onClickSubmit: () => {
                    $(event.target).parent().find("button").removeClass("disabled");
                    $(event.target).parent().find("button").attr("disabled", false);
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
                    $(event.target).parent().find("button").removeClass("disabled");
                    $(event.target).parent().find("button").attr("disabled", false);
                }
            })
        };

        match.updated_at = Date.now();
        let result = await api.updateProductEntities([match]);
        if (result && result.product_entities && result.product_entities[0] && result.product_entities[0].isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Update success for product: </span>
                        <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                            {match.name || ori_match.name}
                        </span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    $(event.target).parent().find("button").removeClass("disabled");
                    $(event.target).parent().find("button").attr("disabled", false);
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
                    let query = queryString.parse(props.location.search);
                    query.page = parseInt(query.page) == query.page && parseInt(query.page) > 0 ? parseInt(query.page) : 1;
                    query.psize = parseInt(query.psize) == query.psize && parseInt(query.psize) > 0 ? parseInt(query.psize) : default_pzise;
                    api.getProductEntityOnly({
                        page: query.page,
                        psize: query.psize
                    })
                        .then(data => {
                            setProductList(JSON.parse(JSON.stringify(data.products)));
                            setOriProductList(JSON.parse(JSON.stringify(data.products)));
                            setProductEdit([...product_edit.filter(item => item !== entity_id)]);
                            setPagination({
                                totalPages: data.totalPages,
                                currentPage: data.currentPage,
                                psize: data.psize,
                                totalFound: data.totalFound
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
        } else {
            let m_failure = result && result.product_entities && result.product_entities[0] && result.product_entities[0] ? result.product_entities[0].m_failure : "";
            appFunction.appAlert({
                icon: "danger",
                title: <div>Action incomplete!</div>,
                message: (
                    <div>
                        <span>Could not update: </span>
                        <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
                            {ori_match.name}
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

    async function deleteProduct (entity_id, event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let product_name;
        let match = ori_product_list.find(item => item.entity_id === entity_id);
        if (match) {
            product_name = match.name;
        };
        appFunction.appAlert({
            icon: "info",
            title: <div>Confirm action</div>,
            message: (
                <div>
                    <span>Do you want to delete following product ?</span>
                    <br />
                    <span style={{color: "var(--colorDanger)", textDecoration: "underline", textAlign: "center", marginTop: "10px", display: "block"}}>
                        {product_name || ""} ({entity_id})
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
                let result = await api.deleteProductEntities([entity_id]);
                if (result && result.isSuccess) {
                    appFunction.appAlert({
                        icon: "success",
                        title: <div>Success</div>,
                        message: (
                            <div>
                                <span>Product: </span>
                                <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                                    {product_name || ""} ({entity_id})
                                </span>
                                <span> deleted!</span>
                            </div>
                        ),
                        timeOut: 1000,
                        onTimeOut: () => {
                            let query = queryString.parse(props.location.search);
                            query.page = parseInt(query.page) == query.page && parseInt(query.page) > 0 ? parseInt(query.page) : 1;
                            query.psize = parseInt(query.psize) == query.psize && parseInt(query.psize) > 0 ? parseInt(query.psize) : default_pzise;
                            api.getProductEntityOnly({
                                page: query.page,
                                psize: query.psize
                            })
                                .then(data => {
                                    setOriProductList(ori_product_list.filter(item => item.entity_id !== entity_id));
                                    setProductList(product_list.filter(item => item.entity_id !== entity_id));
                                    setProductEdit(product_edit.filter(item => item !== entity_id));
                                    setPagination({...pagination, totalFound: pagination.totalFound - 1});
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
                                    {product_name || ""} ({entity_id})
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

    return (
        <div className="product-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/product">New Product</Link>
            </div>
            <div className="content">
                <table className="tb_list">
                    <thead>
                        <tr>
                            <th>ORD</th>
                            {product_entity_columns.map((col_item, index) => {
                                return <th key={index} style={col_item.th_style}>{col_item.column_name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {product_list.map((prod_item, index) => {
                            let startOrd = pagination.currentPage && pagination.psize ? (pagination.currentPage - 1) * pagination.psize : 0;
                            let isOnEdit = product_edit.indexOf(prod_item.entity_id) !== -1;
                            return (
                                <tr key={index} className={`tb-row-item ${isOnEdit ? "onEdit" : ""}`}>
                                    <td className="td_input null ord"><input disabled value={index + 1 + startOrd} /></td>
                                    {product_entity_columns.map((col_item, index) => {
                                        let value = prod_item[col_item.column];
                                        let isNull = "";
                                        if (value === null || value === "" || value === undefined) {
                                            isNull += " null";
                                        };
                                        return col_item.render({
                                            self: col_item,
                                            prod_item: prod_item,
                                            index: index,
                                            changeProductEntity: changeProductEntity,
                                            isNull: isNull,
                                            isOnEdit: isOnEdit
                                        })
                                    })}
                                    <td className="td_action">
                                        <button
                                            tabIndex={-1} className="edit tb_button"
                                            onClick={(event) => {toggleEdit(prod_item, true)}}
                                        >Edit</button>
                                        <button
                                            tabIndex={-1} className="delete tb_button"
                                            onClick={(event) => {deleteProduct(prod_item.entity_id, event)}}
                                        >Delete</button>
                                        <button
                                            tabIndex={-1} className="cancel tb_button"
                                            onClick={(event) => {toggleEdit(prod_item, false)}}
                                        >Cancel</button>
                                        <button
                                            tabIndex={-1} className="save tb_button"
                                            onClick={(event) => updateProduct(prod_item.entity_id, event)}
                                        >Save</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Pagination {...pagination} onChange={(config) => {
                    let query = queryString.parse(props.location.search);
                    query = {...query, ...config};
                    query = queryString.stringify(query);
                    props.history.push(props.location.pathname + "?" + query);
                }} />
            </div>
        </div>
    )
}

export default ProductList;