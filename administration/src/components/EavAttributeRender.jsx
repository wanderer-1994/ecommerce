// html_types: 'input', 'multiinput', 'select', 'multiselect', 'password', 'boolean'
// data_types: 'int', 'decimal', 'varchar', 'text', 'html', 'datetime'
import { Fragment } from "react";
import * as valueValidation from "../objectModels/eav/valueValidation";
import $ from "jquery";
import InputOrTextarea from "./InputOrTexarea";
import Clear from "@material-ui/icons/Clear";
import Add from "@material-ui/icons/Add";
import utility from "../utils/utility";

const forceWidth = {
    width: "100%"
}
const eav_html_type = [
    {
        html_type: "input",
        render: ({ eav_definition, eav_value, state, setState }) => {
            let component_type = "input";
            if (eav_definition.data_type === "text" || eav_definition.data_type === "html") {
                component_type = "textarea";
            }
            return (
                <InputOrTextarea className={utility.isValueEmpty(eav_value.value) ? "null" : ""} component_type={component_type} type="text" value={eav_value.value || ""} 
                    onChange={event => {
                        let value = valueValidation.convertValue({
                            value: event.target.value,
                            data_type: eav_definition.data_type,
                            html_type: eav_definition.html_type
                        });
                        let validation = valueValidation.validateValue({
                            value: value,
                            data_type: eav_definition.data_type,
                            html_type: eav_definition.html_type,
                            validation: eav_definition.validation
                        });
                        if (event.target.value != "" && !validation) {
                            let invalid_message = `<span class="hightlight">${eav_definition.label}</span> must be of type <span class="hightlight">${eav_definition.data_type}</span>
                                ${eav_definition.validation ? `<span> and match regex </span><span class="hightlight">${eav_definition.validation}</span>` : "" } !`;
                            $(event.target).parent(".input_value").find(".alert_message").html(invalid_message);
                            $(event.target).css("color", "var(--colorDanger)");
                            $(event.target).removeClass("hide");
                        } else {
                            $(event.target).parent(".input_value").find(".alert_message").html("");
                            $(event.target).css("color", "");
                            $(event.target).addClass("hide");
                        }
                        eav_value.value = event.target.value;
                        setState({...state})
                    }}
                    style={forceWidth}
                />
            )
        }
    },
    {
        html_type: "multiinput",
        render: ({ eav_definition, eav_value, state, setState }) => {
            if (!Array.isArray(eav_value.value) || eav_value.value.length === 0) {
                eav_value.value = [""];
            }
            let component_type = "input";
            if (eav_definition.data_type === "text" || eav_definition.data_type === "html") {
                component_type = "textarea";
            }
            return (
                <Fragment>
                    {eav_value.value.map((v_item, index) => {
                        return (
                            <Fragment key={index}>
                                <InputOrTextarea className={utility.isValueEmpty(v_item) ? "multiinput_item null" : "multiinput_item"} component_type={component_type} type="text" value={v_item || ""} 
                                    onChange={event => {
                                        let value = valueValidation.convertValue({
                                            value: event.target.value,
                                            data_type: eav_definition.data_type,
                                            html_type: eav_definition.html_type
                                        });
                                        let validation = valueValidation.validateValue({
                                            value: value,
                                            data_type: eav_definition.data_type,
                                            html_type: eav_definition.html_type,
                                            validation: eav_definition.validation
                                        });
                                        if (event.target.value != "" && !validation) {
                                            let invalid_message = `<span class="hightlight">${eav_definition.label}</span> must be of type <span class="hightlight">${eav_definition.data_type}</span>
                                                ${eav_definition.validation ? `<span> and match regex </span><span class="hightlight">${eav_definition.validation}</span>` : "" } !`;
                                            $(event.target).parent(".input_value").find(".alert_message").html(invalid_message);
                                            $(event.target).css("color", "var(--colorDanger)");
                                            $(event.target).removeClass("hide");
                                        } else {
                                            $(event.target).parent(".input_value").find(".alert_message").html("");
                                            $(event.target).css("color", "");
                                            $(event.target).addClass("hide");
                                        }
                                        eav_value.value[index] = event.target.value;
                                        setState({...state})
                                    }}
                                    style={{width: "calc(100% - 40px)"}}
                                />
                                {eav_value.value.length > 1 ? (
                                    <Clear className="multiinput_remove" onClick={() => {
                                        eav_value.value.splice(index, 1);
                                        setState({...state});
                                    }} />
                                ): null}
                                <br/>
                            </Fragment>
                        )
                    })}
                    <Add className="multiinput_add" onClick={() => {
                        eav_value.value.push("");
                        setState({...state});
                    }} />
                </Fragment>
            )
        }
    },
    {
        html_type: "select",
        render: ({ eav_definition, eav_value, state, setState }) => {
            let selected = eav_value.value || "";
            return (
                <select
                    className={selected ? "" : null}
                    value={selected ? selected : ""}
                    onChange={(event) => {
                        if (event.target.value != "") {
                            let option = eav_definition.options.find(item => item.option_value == event.target.value);
                            if (!option) {
                                let invalid_message = `<span class="hightlight">${eav_definition.label}</span> does not have option(s) <span class="hightlight">${event.target.value}</span> !`;
                                $(event.target).parent(".input_value").find(".alert_message").html(invalid_message);
                                $(event.target).css("color", "var(--colorDanger)");
                                $(event.target).removeClass("hide");
                            } else {
                                $(event.target).parent(".input_value").find(".alert_message").html("");
                                $(event.target).css("color", "");
                                $(event.target).addClass("hide");
                            }
                        }
                        eav_value.value = event.target.value;
                        setState({...state});
                    }}
                    style={forceWidth}
                >
                    <option value="">-------------------------------</option>
                    {(eav_definition.options || []).map((option, index) => {
                        return (
                            <option
                                key={index} value={option.option_value}
                            >{option.label || option.option_value}</option>
                        )
                    })}
                </select>
            )
        }
    },
    {
        html_type: "multiselect",
        render: ({ eav_definition, eav_value, state, setState }) => {
            let selected = eav_value.value;
            if (!Array.isArray(selected)) selected = [];
            return (
                <select multiple
                    className={selected.length > 0 ? "" : "null"}
                    value={selected ? selected : null}
                    onChange={(event) => {
                        let selected = Array.from(event.target.selectedOptions, option => option.value);
                        let invalid_value = [];
                        selected.forEach(selected_value => {
                            let match = eav_definition.options.find(item => item.option_value == selected_value);
                            if (!match) {
                                invalid_value.push(selected_value)
                            }
                        });
                        if (invalid_value.length > 0) {
                            let invalid_message = `<span class="hightlight">${eav_definition.label}</span> does not have option(s) <span class="hightlight">${invalid_value.join(", ")}</span> !`;
                            $(event.target).parent(".input_value").find(".alert_message").html(invalid_message);
                            $(event.target).css("color", "var(--colorDanger)");
                            $(event.target).removeClass("hide");
                        } else {
                            $(event.target).parent(".input_value").find(".alert_message").html("");
                            $(event.target).css("color", "");
                            $(event.target).addClass("hide");
                        };
                        eav_value.value = selected;
                        setState({...state});
                    }}
                    style={forceWidth}
                >
                    {(eav_definition.options || []).map((option, index) => {
                        return (
                            <option
                                key={index} value={option.option_value}
                            >{option.label || option.option_value}</option>
                        )
                    })}
                </select>
            )
        }
    },
    {
        html_type: "password",
        render: ({ eav_definition, eav_value, state, setState }) => {
            return (
                <input className={utility.isValueEmpty(eav_value.value) ? "null" : ""} type="password" value={eav_value.value || ""} 
                    onChange={event => {
                        let value = valueValidation.convertValue({
                            value: event.target.value,
                            data_type: eav_definition.data_type,
                            html_type: eav_definition.html_type
                        });
                        let validation = valueValidation.validateValue({
                            value: value,
                            data_type: eav_definition.data_type,
                            html_type: eav_definition.html_type,
                            validation: eav_definition.validation
                        });
                        if (event.target.value != "" && !validation) {
                            let invalid_message = `<span class="hightlight">${eav_definition.label}</span> must be of type <span class="hightlight">${eav_definition.data_type}</span>
                                ${eav_definition.validation ? `<span> and match regex </span><span class="hightlight">${eav_definition.validation}</span>` : "" } !`;
                            $(event.target).parent(".input_value").find(".alert_message").html(invalid_message);
                            $(event.target).css("color", "var(--colorDanger)");
                            $(event.target).removeClass("hide");
                        } else {
                            $(event.target).parent(".input_value").find(".alert_message").html("");
                            $(event.target).css("color", "");
                            $(event.target).addClass("hide");
                        }
                        eav_value.value = event.target.value;
                        setState({...state})
                    }}
                    style={forceWidth}
                />
            )
        }
    },
    {
        html_type: "boolean",
        render: ({ eav_value, state, setState }) => {
            let isCheck = false;
            if (eav_value.value == 1 || eav_value.value === true) isCheck = true;
            return (
                <input type="checkbox" checked={isCheck} 
                    onChange={event => {
                        let new_val = event.target.checked ? 1 : 0;
                        eav_value.value = new_val;
                        setState({...state})
                    }}
                />
            )
        }
    }
]

function EavAttributeRender ({ eav_definition, eav_value, state, setState }) {
    let render_type = eav_html_type.find(item => item.html_type === eav_definition.html_type);
    return (
        <Fragment>
            {render_type ? (
                <div>
                    <span className="input_tag left">
                        <input disabled title={`${eav_definition.attribute_id} (${eav_definition.data_type})`} type="text" value={eav_definition.label} />
                    </span>
                    <span className="input_value left"
                         style={{width: "calc(100% - 170px)"}}
                    >
                        {render_type.render({ eav_definition, eav_value, state, setState })}
                        <div className="alert_message hide"></div>
                    </span>
                </div>
            ) : null}
        </Fragment>
    )
}

export default EavAttributeRender;