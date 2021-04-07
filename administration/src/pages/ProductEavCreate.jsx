import { useState } from "react";
import * as api from "../api/mockApi";
import "../css/detail.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";
import * as EavModel from "../objectModels/EavModel";
import { eav_entity_columns } from "../common/eavCommon";
import EavEntityRender from "../components/EavEntityRender";

function ProductEavCreate (props) {

    const [eav, setEav] = useState({});

    async function submitCreateEav (event) {
        $(event.target).addClass("disabled");
        $(event.target).attr("disabled", true);
        let copy_eav = JSON.parse(JSON.stringify(eav));
        Object.keys(copy_eav).forEach(key => {
            if (copy_eav[key] === null || copy_eav[key] === "" || copy_eav[key] === undefined) {
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
        let validation = EavModel.validateEavModel({
            ...copy_eav,
            html_type: copy_eav.html_type,
            data_type: copy_eav.data_type
        });
        eav_entity_columns
            .filter(col_item => col_item.required === true)
            .forEach(col_item => {
                if (
                    copy_eav[col_item.column] === null ||
                    copy_eav[col_item.column] === "" ||
                    copy_eav[col_item.column] === undefined ||
                    copy_eav[col_item.column].toString().replace(/^\s+|\s+$/g, "") === ""
                ) {
                    validation.isValid = false;
                    validation.m_failure = `'${col_item.column_name}' must not be empty!\n\t` + (validation.m_failure || "");
                }
            });
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
        let data = await api.createProductEavs([copy_eav]);
        let result = data && data.product_eavs ? data.product_eavs[0] : {};
        if (result.isSuccess) {
            appFunction.appAlert({
                icon: "success",
                title: <div>Success</div>,
                message: (
                    <div>
                        <span>Successfully create attribute : </span>
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
            setEav({});
        } else {
            appFunction.appAlert({
                icon: "danger",
                title: <div>Action incomplete!</div>,
                message: (
                    <div>
                        <span>Could not create attribute: </span>
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
        <div className="product-eav-create">
            <div className="title">
                <h3>{props.title}</h3>
                <button className="success float large"
                    onClick={submitCreateEav}
                >Create</button>
            </div>
            <div className="content">
                <EavEntityRender mode="CREATE" eav={eav} setEav={setEav} />
            </div>
        </div>
    )
}

export default ProductEavCreate;