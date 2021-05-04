import { useState, useEffect } from "react";
import * as api from "../api/mockApi";
import "../css/detail.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";
import * as EavModel from "../objectModels/EavModel";
// import { eav_entity_columns } from "../common/eavCommon";
import EavEntityRender from "../components/EavEntityRender";

function ProductEavDetail (props) {

    const [ori_eav, setOriEav] = useState({});
    const [eav, setEav] = useState({});
    const [isLoaded, setIsLoaded] = useState(0);

    useEffect(() => {
        api.getProductEavs().then(product_eavs => {
            let eav = product_eavs.find(item => item.attribute_id == props.match.params.entity_id) || {}; // eslint-disable-line
            setEav(JSON.parse(JSON.stringify(eav)));
            setOriEav(JSON.parse(JSON.stringify(eav)));
            setIsLoaded(1);
        }).catch(err => {
            console.log(err);
        });
    }, [props.match.params.entity_id]);

    async function submitUpdateEav (event) {
        $(event.target).addClass("disabled");
        $(event.target).attr("disabled", true);
        let copy_eav = JSON.parse(JSON.stringify(eav));
        Object.keys(copy_eav).forEach(key => {
            if (copy_eav[key] === ori_eav[key] && key !== "attribute_id") {
                delete copy_eav[key];
            }
        });
        if (Array.isArray(copy_eav.options)) {
            copy_eav.options.forEach((opt_item, index) => {
                if (opt_item.option_value === null || opt_item.option_value === "" || opt_item.option_value === undefined) {
                    copy_eav.options[index] = null;
                    return;
                };
            });
            copy_eav.options = copy_eav.options.filter(item => item !== null);
            copy_eav.options.forEach((item, index) => item.sort_order = index + 1)
        };
        if (JSON.stringify(copy_eav.options) === JSON.stringify(ori_eav.options)) delete copy_eav.options;
        let validation = EavModel.validateEavModel({
            ...copy_eav,
            html_type: copy_eav.html_type || eav.html_type,
            data_type: copy_eav.data_type || eav.data_type
        });
        if (copy_eav.attribute_id === null || copy_eav.attribute_id.toString().replace(/^\s+|\s+$/g, "").length === 0 || copy_eav.attribute_id === undefined) {
            validation.isValid = false;
            validation.m_failure = `'attribute_id' must not be empty!\n\t` + (validation.m_failure || "");
        };
        if (Object.keys(copy_eav).length === 1) {
            validation.isValid = false;
            validation.m_failure = `Please make changes before save!\n\t` + (validation.m_failure || "");
            return appFunction.appAlert({
                icon: "info",
                title: <div>No changes detected</div>,
                message: <div style={{whiteSpace: "pre-line"}}>{validation.m_failure}</div>,
                timeOut: 700,
                onTimeOut: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
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
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            })
        };
        let data = await api.updateProductEavs([copy_eav]);
        let result = data && data.product_eavs ? data.product_eavs[0] : {};
        if (result.isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Successfully update attribute : </span>
                        <span style={{color: "var(--colorSuccess)", textDecoration: "underline"}}>
                            {eav.label}
                        </span>
                    </div>
                ),
                timeOut: 1000,
                onTimeOut: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            });
            api.getProductEavs()
            .then(product_eavs => {
                let eav = product_eavs.find(item => item.attribute_id == props.match.params.entity_id) || {}; // eslint-disable-line
                setEav(JSON.parse(JSON.stringify(eav)));
                setOriEav(JSON.parse(JSON.stringify(eav)));
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            appFunction.appAlert({
                icon: "danger",
                title: <div>Action incomplete!</div>,
                message: (
                    <div>
                        <span>Could not update attribute: </span>
                        <span style={{color: "var(--colorDanger)", textDecoration: "underline"}}>
                            {eav.label}
                        </span>
                        <span> !</span>
                        <div style={{marginTop: "10px", fontSize: "14px", color: "#000000", fontStyle: "italic", textDecoration: "underline"}}>
                            Error log:
                        </div>
                        <div style={{marginTop: "5px", fontSize: "12px", color: "#000000", fontStyle: "italic"}}>
                            {result.m_failure || ""}
                        </div>
                    </div>
                ),
                showConfirm: true,
                submitTitle: "OK",
                onClickSubmit: () => {
                    $(event.target).removeClass("disabled");
                    $(event.target).attr("disabled", false);
                }
            });
        }
    }

    return (
        <div className="product-eav-detail">
            <div className="title">
                <h3>{props.title} {ori_eav && ori_eav.label ? <span>: <span style={{fontStyle: "italic", color: "var(--colorSuccess)"}}>{ori_eav.label}</span></span> : null}</h3>
                <button className="warning float large"
                    onClick={submitUpdateEav}
                >Update</button>
            </div>
            <div className="content">
                {isLoaded && !eav.attribute_id ? (
                    <div style={{marginTop: "20px", fontSize: "20px", fontStyle: "italic"}}>
                        No attribute with id <span style={{color: "var(--colorWarning)", textDecoration: "underline"}}>{props.match.params.entity_id}</span> found !!!
                    </div>
                ) : (
                    <EavEntityRender mode="UPDATE" eav={eav} setEav={setEav} />
                )}
            </div>
        </div>
    )
}

export default ProductEavDetail;