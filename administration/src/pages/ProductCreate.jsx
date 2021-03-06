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
                <input type="text" value={state[self.column] || ""}
                    onChange={event => setState({...state, [self.column]: event.target.value})}
                />
            )
        }
    },
    {
        column: "type_id",
        column_name: "Product type",
        render: ({ self, state, setState }) => {
            if (!state[self.column]) state[self.column] = "simple";
            return (
                <select value={state[self.column] || ""}
                    onChange={event => {
                        if (event.target.value === "variant") {
                            delete state.categories;
                            delete state.parent;
                        } else {
                            delete state.parent;
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
                    <option value="simple">Simple</option>
                    <option value="master">Master</option>
                    <option value="variant">Variant</option>
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

function ProductCreate (props) {

    const [productEntity, setProductEntity] = useState({});
    const [productEavs, setProductEavs] = useState([]);
    const [entityEavGroup, setEntityEavGroup] = useState([]);
    const [eavGroupIncluded, setEavGroupIncluded] = useState([]);
    const [isLoaded, setIsLoaded] = useState(0);

    useEffect(() => {
        let promises = [];
        promises.push(
            api.getProductEavs().then(product_eavs => {
                setProductEavs(product_eavs || []);
            }).catch(err => {
                console.log(err);
            })
        );
        promises.push(
            api.getEavGroups("product").then(data => {
                setEntityEavGroup(data.eav_groups || []);
                let included = [];
                (data.eav_groups || []).forEach(item => {
                    (item.attributes || []).forEach(attribute => {
                        included.push(attribute.attribute_id);
                    });
                });
                setEavGroupIncluded(included);
            }).catch(err => {
                console.log(err);
            })
        )
        Promise.all(promises).then(() => {
            setIsLoaded(1);
        })
    }, []);

    async function submitCreateProduct (event) {
        $(event.target).parent().find("button").addClass("disabled");
        $(event.target).parent().find("button").attr("disabled", true);
        let copy_entity = JSON.parse(JSON.stringify(productEntity));
        Object.keys(copy_entity).forEach(key => {
            if (utility.isValueEmpty(copy_entity[key])) {
                delete copy_entity[key];
            } 
        });
        if (Array.isArray(copy_entity.attributes)) {
            for (let i = 0; i < copy_entity.attributes.length; i++) {
                let attribute = copy_entity.attributes[i];
                if (utility.isValueEmpty(attribute.value)) {
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

        copy_entity.created_at = Date.now();
        copy_entity.updated_at = copy_entity.created_at;
        let result = await api.createProductEntities([copy_entity]);
        if (result && result.product_entities && result.product_entities[0] && result.product_entities[0].isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Product created! </span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    $(event.target).parent().find("button").removeClass("disabled");
                    $(event.target).parent().find("button").attr("disabled", false);
                    setProductEntity(copy_entity);
                }
            });
        } else {
            let m_failure = result && result.product_entities && result.product_entities[0] && result.product_entities[0] ? result.product_entities[0].m_failure : "";
            console.log(result);
            appFunction.appAlert({
                icon: "danger",
                title: <div>Action incomplete!</div>,
                message: (
                    <div>
                        <span>Could not create: </span>
                        <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
                            {productEntity.entity_id}
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
        <div className="product-create">
            <div className="title">
                <h3>{props.title}</h3>
                <button className="success float large"
                    onClick={submitCreateProduct}
                >Create</button>
            </div>
            <div className="content">
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
                                        setState: setProductEntity
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
                        {productEntity.type_id !== "variant" ? (
                            <span className="item" data-binding="categories"
                                onClick={event => switchSection(event)}
                            >Categories</span>
                        ) : null}
                    </h4>
                    <div className="section-item attributes active">
                        {entityEavGroup.map((eav_group, index) => {
                            return (
                                <Fragment key={index}>
                                    <h4 className="eav-group-title">{eav_group.group_id}</h4>
                                    {(eav_group.attributes || []).map((attribute, attr_idx) => {
                                        let eav_item = productEavs.find(item => item.attribute_id === attribute.attribute_id);
                                        if (!eav_item) return null;
                                        let eav_value = (productEntity.attributes || []).find(item => item.attribute_id === eav_item.attribute_id);
                                        if (!eav_value) {
                                            eav_value = {
                                                attribute_id: eav_item.attribute_id
                                            };
                                            if (!Array.isArray(productEntity.attributes)) productEntity.attributes = [];
                                            productEntity.attributes.push(eav_value);
                                        }
                                        let Component = EavAttributeRender;
                                        if (Object.keys(EavCustomRender).indexOf(eav_item.attribute_id) !== -1) {
                                            Component = EavCustomRender[eav_item.attribute_id];
                                        }
                                        return <Component key={attr_idx} eav_definition={eav_item} eav_value={eav_value} state={productEntity} setState={setProductEntity} c_multiple={true} />
                                    })}
                                </Fragment>
                            )
                        })}
                        <h4 className="eav-group-title">Ungrouped attributes</h4>
                        {productEavs.map((eav_item, index) => {
                            if (eavGroupIncluded.indexOf(eav_item.attribute_id) !== -1) return null;
                            let eav_value = (productEntity.attributes || []).find(item => item.attribute_id === eav_item.attribute_id);
                            if (!eav_value) {
                                eav_value = {
                                    attribute_id: eav_item.attribute_id
                                };
                                if (!Array.isArray(productEntity.attributes)) productEntity.attributes = [];
                                productEntity.attributes.push(eav_value);
                            }
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
                    {productEntity.type_id !== "variant" ? (
                        <div className="section-item categories">
                            <CategoryAssignment productEntity={productEntity} setProductEntity={setProductEntity} ori_product={productEntity} />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default ProductCreate;