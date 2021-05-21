import { useState, useEffect, Fragment } from "react";
import * as api from "../api/mockApi";
import "../css/detail.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";
import EavAttributeRender from "../components/EavAttributeRender";
import * as ProductModel from "../objectModels/ProductModel";
import Parent from "./product/Parent";
import Variant from "./product/Variant";
import CategoryAssignment from "./product/CategoryAssignment";
import utility from "../utils/utility";
import EavCustomRender from "./product/EavCustomRender";

const product_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        required: true,
        render: ({ self, state, setState }) => {
            return (
                <input disabled type="text" value={state[self.column] || ""} />
            )
        }
    },
    {
        column: "type_id",
        column_name: "Product type",
        render: ({ self, state, setState, ori_product }) => {
            return (
                <select value={state[self.column] || ""}
                    onChange={event => {
                        let ori_entity = ProductModel.extractProductEntity({
                            product: ori_product,
                            entity_id: state.entity_id
                        });
                        if (event.target.value === "variant") {
                            state.categories = null;
                            state.parent = ori_entity.parent;
                        } else {
                            state.parent = null;
                            state.categories = JSON.parse(JSON.stringify(ori_entity.categories || ""));
                        }
                        setState({ ...state, [self.column]: event.target.value });
                        // re-render sections
                        setTimeout(() => {
                            let section_selected = false;
                            $(".section-title .item").each(function () {
                                if ($(this).hasClass("active")) {
                                    section_selected = true;
                                }
                            });
                            if (!section_selected) {
                                switchSection(null, "attributes")
                            }
                        }, 100)
                    }}
                >
                    <option value="">----------</option>
                    <option value="master">Master</option>
                    <option value="variant">Variant</option>
                    <option value="simple">Simple</option>
                </select>
            )
        }
    },
    {
        column: "tier_price",
        column_name: "Tier price",
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={(state[self.column] || "").toLocaleString().replace(/\./g, ",")} onChange={event => setState({ ...state, [self.column]: parseInt(event.target.value.replace(/,/g, "")) })} />
            )
        }
    },
    {
        column: "available_quantity",
        column_name: "Q'ty available",
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "created_at",
        column_name: "Created at",
        required: true,
        render: ({ self, state, setState }) => {
            let value = "";
            if (typeof(state[self.column]) === "number") {
                let timezoneoffset = (new Date()).getTimezoneOffset(); // time zone offset is in minute
                let date = new Date(state[self.column] - timezoneoffset * 60 * 1000);
                value = date.toISOString().replace(/:\S{7}$/g, "");
            };
            return (
                <input type="datetime-local" value={value} style={{overflow: "hidden"}} disabled
                    onChange={event => {
                        let new_value = (new Date(event.target.value)).getTime();
                        setState({ ...state, [self.column]: new_value })
                    }}
                />
            )
        }
    },
    {
        column: "updated_at",
        column_name: "Last update",
        required: true,
        render: ({ self, state, setState }) => {
            let value = "";
            if (typeof(state[self.column]) === "number") {
                let timezoneoffset = (new Date()).getTimezoneOffset(); // time zone offset is in minute
                let date = new Date(state[self.column] - timezoneoffset * 60 * 1000);
                value = date.toISOString().replace(/:\S{7}$/g, "");
            };
            return (
                <input type="datetime-local" value={value} style={{overflow: "hidden"}} disabled
                    onChange={event => {
                        let new_value = (new Date(event.target.value)).getTime();
                        setState({ ...state, [self.column]: new_value })
                    }}
                />
            )
        }
    }
];

function switchSection (event, section) {
    let data_binding = event ? $(event.target).data("binding") : section;
    if (data_binding) {
        // process titles
        $(".section-title .item").each(function () {
            if ($(this).data("binding") === data_binding) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        })
        // process section-item
        $(".section-item").each(function () {
            if ($(this).hasClass(data_binding)) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        })
    }

}

function ProductDetail (props) {

    const [ori_product, setOriProduct] = useState({});
    const [productEntity, setProductEntity] = useState({});
    const [productEavs, setProductEavs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(0);

    useEffect(() => {
        let promises = [];
        promises.push(
            api.adminSearchProduct({
                entity_ids: [props.match.params.entity_id].join("|")
            }).then(data => {
                let product = data.products && data.products[0] ? data.products[0] : {};
                let entity = ProductModel.extractProductEntity({
                    product: product,
                    entity_id: props.match.params.entity_id
                })
                setProductEntity(JSON.parse(JSON.stringify(entity)));
                setOriProduct(product);
            }).catch(err => {
                console.log(err);
            })
        )
        promises.push(
            api.getProductEavs().then(product_eavs => {
                setProductEavs(product_eavs || []);
            }).catch(err => {
                console.log(err);
            })
        );
        Promise.all(promises).then(() => {
            setIsLoaded(1);
        })
    }, [props.match.params.entity_id]);

    async function submitUpdateProductEntity (event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let ori_entity = ProductModel.extractProductEntity({
            product: ori_product,
            entity_id: productEntity.entity_id
        });
        let copy_entity = JSON.parse(JSON.stringify(productEntity));
        let unassigned_categories = (ori_entity.categories || []).filter(item => {
            // if category exists in ori_entity & not exists in copy_entity => it is unassigned
            return !(copy_entity.categories || []).find(m_item => m_item.category_id === item.category_id);
        });
        unassigned_categories = JSON.parse(JSON.stringify(unassigned_categories));
        if (unassigned_categories.length > 0) {
            unassigned_categories.forEach(item => item.action = "UNASSIGN");
            copy_entity.categories = copy_entity.categories || [];
            copy_entity.categories.push(...unassigned_categories)
        };
        Object.keys(copy_entity).forEach(key => {
            if (JSON.stringify(copy_entity[key]) === JSON.stringify(ori_entity[key]) && key !== "entity_id") {
                delete copy_entity[key];
            } 
        });
        if (Array.isArray(copy_entity.attributes)) {
            for (let i = 0; i < copy_entity.attributes.length; i++) {
                let attribute = copy_entity.attributes[i];
                let match = (ori_entity.attributes || []).find(item => item.attribute_id === attribute.attribute_id) || {};
                if (JSON.stringify(match.value) === JSON.stringify(attribute.value) || (match.value === undefined && utility.isValueEmpty(attribute.value))) {
                    copy_entity.attributes.splice(i, 1);
                    i -= 1;
                    continue;
                };
                if (Array.isArray(attribute.value)) {
                    attribute.value = attribute.value.filter(item => !utility.isValueEmpty(item));
                    if (attribute.value.length === 0) {
                        copy_entity.attributes.splice(i, 1);
                        i -= 1;
                        continue;
                    }
                }
            };
            if (copy_entity.attributes.length === 0) {
                delete copy_entity.attributes;
            } else {
                copy_entity.attributes.forEach((item, index) => {
                    let definition = productEavs.find(def_item => def_item.attribute_id === item.attribute_id) || {};
                    copy_entity.attributes[index] = {...definition, ...item};
                })
            }
        };
        let validation = ProductModel.validateProductModel(copy_entity);
        if (! "entity_id" in copy_entity) {
            validation.isValid = false;
            validation.m_failure = `No 'entity_id' specified!\n\t` + (validation.m_failure || "");
        }
        if (Object.keys(copy_entity).length === 1) {
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

        copy_entity.updated_at = Date.now();
        let result = await api.updateProductEntities([copy_entity]);
        if (result && result.product_entities && result.product_entities[0] && result.product_entities[0].isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Update success for product: </span>
                        <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                            {copy_entity.entity_id}
                        </span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    $(event.target).parent().find("button").removeClass("disabled");
                    $(event.target).parent().find("button").attr("disabled", false);
                    api.adminSearchProduct({
                        entity_ids: [props.match.params.entity_id].join("|")
                    }).then(data => {
                        let product = data.products && data.products[0] ? data.products[0] : {};
                        let entity = ProductModel.extractProductEntity({
                            product: product,
                            entity_id: props.match.params.entity_id
                        })
                        setProductEntity(JSON.parse(JSON.stringify(entity)));
                        setOriProduct(product);
                    }).catch(err => {
                        console.log(err);
                    })
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
                            {copy_entity.entity_id}
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
    }

    return (
        <div className="product-detail">
            <div className="title">
                <h3>{props.title}{productEntity && productEntity.entity_id && productEntity.entity_id ? <span>: <span style={{fontStyle: "italic", color: "var(--colorSuccess)"}}>{productEntity.entity_id}</span></span> : ""}</h3>
                <button className="warning float large"
                    onClick={submitUpdateProductEntity}
                >Update</button>
            </div>
            <div className="content">
                {isLoaded && !ori_product.product_id ? (
                    <div style={{marginTop: "20px", fontSize: "20px", fontStyle: "italic"}}>
                        No product with id <span style={{color: "var(--colorWarning)", textDecoration: "underline"}}>{props.match.params.entity_id}</span> found !!!
                    </div>
                ) : (
                    <Fragment>
                        <div className="entity-id">
                            <h4 className="section-title">Entity ID</h4>
                            {product_columns.map((col_item, index) => {
                                return (
                                    <div key={index} className="entity-column" style={{ display: "inline-block", marginRight: "10px" }}>
                                        <span className="input_tag left">
                                            <input title={col_item.column} disabled type="text" value={col_item.column_name} />
                                        </span>
                                        <span className="input_value center">
                                            {col_item.render({
                                                self: col_item,
                                                state: productEntity,
                                                setState: setProductEntity,
                                                ori_product: ori_product,
                                            })}
                                            <div className="alert_message hide"></div>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="entity-eav">
                            <h4 className="section-title">
                                <span className="item active" data-binding="attributes"
                                    onClick={event => switchSection(event)}
                                >Attributes</span>
                                {productEntity.type_id === "variant" ? (
                                    <span className="item" data-binding="parent"
                                        onClick={event => switchSection(event)}
                                    >Parent</span>
                                ) : null}
                                {productEntity.type_id === "master" ? (
                                    <span className="item" data-binding="variants"
                                        onClick={event => switchSection(event)}
                                    >Variants</span>
                                ) : null}
                                {productEntity.type_id !== "variant" ? (
                                    <span className="item" data-binding="categories"
                                        onClick={event => switchSection(event)}
                                    >Categories</span>
                                ) : null}
                            </h4>
                            <div className="section-item attributes active">
                                {productEavs.map((eav_item, index) => {
                                    let eav_value = (productEntity.attributes || []).find(item => item.attribute_id === eav_item.attribute_id);
                                    if (!eav_value) {
                                        eav_value = {
                                            attribute_id: eav_item.attribute_id
                                        };
                                        if (!Array.isArray(productEntity.attributes)) productEntity.attributes = [];
                                        productEntity.attributes.push(eav_value);
                                    };
                                    let Component = EavAttributeRender;
                                    if (Object.keys(EavCustomRender).indexOf(eav_item.attribute_id) !== -1) {
                                        Component = EavCustomRender[eav_item.attribute_id];
                                    }
                                    return <Component key={index} eav_definition={eav_item} eav_value={eav_value} state={productEntity} setState={setProductEntity} c_multiple={true} />
                                })}
                            </div>
                            {productEntity.type_id === "variant" ? (
                                <div className="section-item parent">
                                    <Parent productEntity={productEntity} setProductEntity={setProductEntity} />
                                </div>
                            ) : null}
                            {productEntity.type_id === "master" ? (
                                <div className="section-item variants">
                                    <Variant productEntity={productEntity} setProductEntity={setProductEntity} ori_product={ori_product} />
                                </div>
                            ) : null}
                            {productEntity.type_id !== "variant" ? (
                                <div className="section-item categories">
                                    <CategoryAssignment productEntity={productEntity} setProductEntity={setProductEntity} ori_product={ori_product} />
                                </div>
                            ) : null}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default ProductDetail;