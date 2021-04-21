import { Fragment, useEffect, useState } from "react";
import Clear from "@material-ui/icons/Clear";
import ArrowRight from "@material-ui/icons/ArrowRight";
import * as api from "../../api/mockApi";
import $ from "jquery";
import * as appFunction from "../../utils/appFunction";
import utility from "../../utils/utility";

function ProductAssignment ({ category, productAssignment, setProductAssignment, ori_productAssignment, setOriProductAssignment }) {

    const [avalableProducts, setAvailableProducts] = useState([]);

    useEffect(() => {
        api.getProductEntityOnly({
            type_id: ["simple", "master"],
            psize: "infinite"
        }).then(data => {
            let products = data.products || [];
            setAvailableProducts(products);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    async function updateCategoryProducts (event) {
        $(event.target).addClass("disabled");
        $(event.target).attr("disabled", true);
        let unassigned = ori_productAssignment.filter(item => {
            // if product exists in ori_productAssignment & not exists in productAssignment => it is unassigned
            return !productAssignment.find(m_item => m_item.product_id === item.product_id)
        });
        let product_entities = [];
        productAssignment.forEach(item => {
            product_entities.push({
                entity_id: item.product_id,
                categories: [{
                    category_id: category.entity_id,
                    position: item.position,
                    action: "ASSIGN"
                }]
            })
        });
        unassigned.forEach(item => {
            product_entities.push({
                entity_id: item.product_id,
                categories: [{
                    category_id: category.entity_id,
                    action: "UNASSIGN"
                }]
            })
        });

        if (JSON.stringify(productAssignment) === JSON.stringify(ori_productAssignment) || product_entities.length === 0) {
            return appFunction.appAlert({
                icon: "info",
                title: <div>No changes detected</div>,
                message: <div style={{whiteSpace: "pre-line"}}>Please make changes before save!</div>,
                timeOut: 700,
                onTimeOut: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            })
        };
        let result = await api.updateProductEntities(product_entities);
        let m_failure = "";
        if (result && result.product_entities) {
            result.product_entities.forEach(item => {
                if (!item.isSuccess) {
                    m_failure += `\n\tFailed to update assignment for product "${item.entity_id}", reason:\n${item.m_failure}`;
                }
            })
        };
        if (m_failure) {
            appFunction.appAlert({
                icon: "warning",
                title: <div>Some failure occured!</div>,
                message: <div style={{whiteSpace: "pre-line"}}>{m_failure}</div>,
                submitTitle: "OK",
                onClickSubmit: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            })
        } else {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Successfully update product assignment!</span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            });
        };
        api.getCategoryProducts(category.entity_id).then(products => {
            setProductAssignment(JSON.parse(JSON.stringify(products)));
            setOriProductAssignment(JSON.parse(JSON.stringify(products)));
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="category-section-product-assignment">
            <button className="warning float section-button large"
                onClick={updateCategoryProducts}
            >Apply</button>
            {productAssignment.map((prod_item, index) => {
                prod_item.position = index + 1;
                let product_name = (avalableProducts.find(item => item.entity_id === prod_item.product_id) || {}).name || "";
                return (
                    <div key={index}>
                        {/* <span className="input_value left">
                            <select value={prod_item}
                                onChange={() => console.log(1)}
                            >
                                <option value={prod_item.product_id}>{prod_item.product_id}</option>
                                {avalableProducts.map((item, index) => {
                                    let isExisted = productAssignment.find(c_item => c_item.product_id === item.entity_id);
                                    return isExisted ? null : (
                                            <option key={index} value={item.entity_id}>{item.entity_id} {utility.isValueEmpty(item.name) ? "" : `(${item.name})`}</option>
                                        )
                                })}
                            </select>
                        </span> */}
                        <span className="input_value left">
                            <input disabled type="text" value={prod_item.product_id} />
                        </span>
                        <span className="input_tag left" style={{marginLeft: "5px"}}>
                            <a target="blank" href={`/product/${prod_item.product_id}`}>
                                <input disabled type="text" value={product_name}
                                    style={{minWidth: "300px", cursor: "pointer"}}
                                />
                            </a>
                        </span>
                        <span className="input_value right">
                            <input className="position" type="text" value={null} placeholder={prod_item.position}
                                style={{width: "50px"}}
                            />
                        </span>
                        <span className="input_value" style={{marginLeft: "5px", marginRight: "15x"}}>
                            <ArrowRight className="multiinput_add" onClick={(event) => {
                                let $target = $(event.target).parent().parent().find("input.position");
                                $target.trigger("blur");
                                setTimeout(() => {
                                    let new_pos = $target.val();
                                    if (parseInt(new_pos) == new_pos && new_pos > 0) {
                                        new_pos = parseInt(new_pos);
                                        productAssignment.splice(index, 1);
                                        productAssignment.splice(new_pos - 1, 0, prod_item);
                                        setProductAssignment([...productAssignment]);
                                        $target.val("");
                                    } else {
                                        appFunction.appAlert({
                                            icon: "warning",
                                            title: <div>Invalid position</div>,
                                            message: <div style={{whiteSpace: "pre-line"}}>Position must be positive int</div>,
                                            showConfirm: true,
                                            submitTitle: "OK",
                                            onClickSubmit: () => {
                                                $(event.target).removeClass("disabled");
                                                $(event.target).attr("disabled", false);
                                            }
                                        })
                                    };
                                }, 50);
                            }} />
                        </span>
                        <span className="input_value">
                            <Clear className="multiinput_remove" onClick={() => {
                                productAssignment = productAssignment.filter(item => item.product_id !== prod_item.product_id);
                                setProductAssignment(productAssignment);
                            }} />
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

export default ProductAssignment;