import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/mockApi";
import * as appFunction from "../utils/appFunction";
import * as ProductModel from "../objectModels/ProductModel";
import $ from "jquery";
import "../css/list.css";
import queryString from "query-string";

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
        column: "type_id",
        column_name: "Product type",
        data_type: "text",
        align: "right",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
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
        }
    },
    {
        column: "created_at",
        column_name: "Created at",
        data_type: "text",
        align: "right",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        }
    },
    {
        column: "updated_at",
        column_name: "Last update",
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
        query.psize = parseInt(query.psize) == query.psize && parseInt(query.psize) > 0 ? parseInt(query.psize) : 400;
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
        let match = (product_list).find(item => item.entity_id === entity_id);
        let validation = ProductModel.validateProductModel(match);
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
        // let result = await api.updateCategories([match]);
        // if (result && result.categories && result.categories[0] && result.categories[0].isSuccess) {
        //     appFunction.appAlert({
        //         icon: "success",
        //         title: <div>Success</div>,
        //         message: (
        //             <div>
        //                 <span>Update success for category: </span>
        //                 <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
        //                     {result.categories[0].name}
        //                 </span>
        //             </div>
        //         ),
        //         timeOut: 1000,
        //         onTimeOut: () => {
        //             api.getProductEntityOnly()
        //             .then(data => {
        //                 category_list.temp = category_list.temp.filter(item => item.entity_id !== entity_id);
        //                 setCategoryList({
        //                     ...category_list, ...data
        //                 });
        //                 setTimeout(() => {
        //                     let target = $(".tb-row-item td.key input");
        //                     for (let i = 0; i < target.length; i++) {
        //                         if (target.eq(i).val() == entity_id) { // eslint-disable-line
        //                             target = target.eq(i).parents(".tb-row-item")[0];
        //                             break;
        //                         };
        //                     };
        //                     blinkRow(target);
        //                 }, 50);
        //                 $(event.target).parent().find("button").removeClass("disabled");
        //                 $(event.target).parent().find("button").attr("disabled", false);
        //             })
        //             .catch(err => {
        //                 console.log(err);
        //             })
        //         }
        //     });
        // } else {
        //     let m_failure = result && result.categories && result.categories[0] && result.categories[0] ? result.categories[0].m_failure : "";
        //     appFunction.appAlert({
        //         icon: "danger",
        //         title: <div>Action incomplete!</div>,
        //         message: (
        //             <div>
        //                 <span>Could not update: </span>
        //                 <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
        //                     {match.name}
        //                 </span>
        //                 <span> !</span>
        //                 <div style={{marginTop: "10px", fontSize: "14px", color: "#000000", fontStyle: "italic", textDecoration: "underline"}}>
        //                     Error log:
        //                 </div>
        //                 <div style={{marginTop: "5px", fontSize: "12px", color: "#000000", fontStyle: "italic"}}>
        //                     {m_failure}
        //                 </div>
        //             </div>
        //         ),
        //         showConfirm: true,
        //         submitTitle: "OK",
        //         onClickSubmit: () => {
        //             $(event.target).parent().find("button").removeClass("disabled");
        //             $(event.target).parent().find("button").attr("disabled", false);
        //         }
        //     });
        // }
    };

    async function deleteProduct (entity_id, event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let product_name;
        let match = ori_product_list.find(item => item.entity_id === entity_id);
        if (match) {
            product_name = match.name;
        };
        console.log("hehe")
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
                let result = await api.deleteProducts([entity_id]);
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
                            query.psize = parseInt(query.psize) == query.psize && parseInt(query.psize) > 0 ? parseInt(query.psize) : 30;
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
                            let isOnEdit = product_edit.indexOf(prod_item.entity_id) !== -1;
                            return (
                                <tr key={index} className={`tb-row-item ${isOnEdit ? "onEdit" : ""}`}>
                                    <td className="td_input null ord"><input disabled value={index + 1} /></td>
                                    {product_entity_columns.map((col_item, index) => {
                                        let value = prod_item[col_item.column];
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
                                                    <Link to={`/category/${prod_item.entity_id}`} target="_blank">
                                                        <input
                                                            disabled type={col_item.data_type} value={(value === null || value === "" || value === undefined) ? "" : value}
                                                        />
                                                    </Link>
                                                )
                                                : (
                                                    <input
                                                        disabled={!isOnEdit} type={col_item.data_type} value={(value === null || value === "" || value === undefined) ? "" : value}
                                                        onChange={(event) => {changeProductEntity({
                                                            entity_id: prod_item.entity_id,
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
            </div>
        </div>
    )
}

export default ProductList;