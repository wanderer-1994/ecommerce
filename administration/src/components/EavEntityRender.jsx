import { Fragment } from "react";
import InputOrTextarea from "../components/InputOrTexarea";
import * as valueValidation from '../objectModels/eav/valueValidation';
import Clear from "@material-ui/icons/Clear";
import Add from "@material-ui/icons/Add";
import { eav_entity_columns } from "../common/eavCommon";
import utility from "../utils/utility";

function EavEntityRender ({ mode, eav, setEav }) {
    return (
        <Fragment>
            <div className="entity-id">
                <h4 className="section-title">Entity ID</h4>
                {eav_entity_columns.map((col_item, index) => {
                    return (
                        <div key={index} className="entity-column" style={{ display: "inline-block", marginRight: "10px" }}>
                            <span className="input_tag left">
                                <input title={col_item.column} disabled type="text" value={col_item.column_name} />
                            </span>
                            <span className="input_value center">
                                {col_item.render({
                                    self: col_item,
                                    state: eav,
                                    setState: setEav,
                                    mode: mode
                                })}
                                <div className="alert_message hide">{col_item.invalid_message}</div>
                            </span>
                        </div>
                    )
                })}
            </div>
            {["select", "multiselect"].indexOf(eav.html_type) !== -1 ? (
                <Fragment>
                    <div className="entity-option">
                        <h4 className="section-title">Options</h4>
                        <span className="input_value left"
                            style={{width: "calc(100% - 170px)"}}
                        >
                            {(function () {
                                if (!Array.isArray(eav.options) || eav.options.length === 0) {
                                    eav.options = [{option_value: "", label: ""}];
                                }
                                let component_type = "input";
                                if (eav.data_type === "text" || eav.data_type === "html") {
                                    component_type = "textarea";
                                };
                                return (
                                    <Fragment>
                                        {eav.options.map((v_item, index) => {
                                            let isNull = !v_item || utility.isValueEmpty(v_item.option_value);
                                            let isNullLabel = !v_item || utility.isValueEmpty(v_item.label);
                                            // validation message
                                            let invalid_message = "";
                                            let converted_value = valueValidation.convertValue({
                                                value: v_item.option_value,
                                                data_type: eav.data_type,
                                                html_type: eav.html_type
                                            });
                                            let validation = valueValidation.validateValue({
                                                value: converted_value,
                                                data_type: eav.data_type,
                                                html_type: eav.html_type,
                                                validation: eav.validation
                                            });
                                            if (v_item.option_value != "" && !validation) { // eslint-disable-line
                                                invalid_message =
                                                <span>
                                                    Option must be of type <span className="hightlight">{eav.data_type}</span>
                                                    {eav.validation ? <span><span> and match regex </span><span className="hightlight">{eav.validation}</span></span> : "" } !
                                                </span>
                                            }
                                            return (
                                                <div className="input_value" key={index}
                                                    style={{display: "block"}}
                                                >
                                                    <span style={{width: "calc(100% - 300px)", display: "inline-block", verticalAlign: "top"}}>
                                                        <InputOrTextarea 
                                                            className={`multiinput_item${isNull ? " null" : ""}`}
                                                            component_type={component_type}
                                                            type="text" value={v_item.option_value || ""}
                                                            placeholder="value"
                                                            onChange={event => {
                                                                eav.options[index].option_value = event.target.value;
                                                                setEav({...eav})
                                                            }}
                                                            style={{width: "100%"}}
                                                        />
                                                        <div
                                                            className={`alert_message ${invalid_message ? "hide" : ""}`}
                                                            style={invalid_message ? {color: "var(--colorDanger)"} : {}}
                                                        >{invalid_message}</div>
                                                    </span>
                                                    <span style={{verticalAlign: "top"}}>
                                                        <input type="text" placeholder="label" value={v_item.label || ""}
                                                            className={`multiinput_item${isNullLabel ? " null" : ""}`}
                                                            style={{width: "250px", marginLeft: "10px"}}
                                                            onChange={event => {
                                                                eav.options[index].label = event.target.value;
                                                                setEav({...eav})
                                                            }}
                                                        />
                                                    </span>
                                                    {eav.options.length > 1 ? (
                                                        <Clear className="multiinput_remove" onClick={() => {
                                                            eav.options.splice(index, 1);
                                                            setEav({...eav});
                                                        }} />
                                                    ): null}
                                                    <br/>
                                                </div>
                                            )
                                        })}
                                        <Add className="multiinput_add" onClick={() => {
                                            eav.options.push({option_value: ""});
                                            setEav({...eav});
                                        }} />
                                    </Fragment>
                                )
                            })()}
                        </span>
                    </div>
                </Fragment>
            ) : null}
        </Fragment>
    )
}

export default EavEntityRender;