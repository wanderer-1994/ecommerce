import { useState, Fragment } from "react";
import * as valueValidation from "../objectModels/eav/valueValidation";
import Clear from "@material-ui/icons/Clear";
import Add from "@material-ui/icons/Add";
import utility from "../utils/utility";
import FileBrowser from "../components/FileBrowser";
import axios from "axios";
import "./ImageSelector.css";

function Item ({ value, onChange }) {
    const [open_file_browser, setOpenFileBrowser] = useState(false);
    return (
        <Fragment>
            <input className="multiinput_item" disabled type="text" value={value} style={{width: "calc(100% - 90px)"}} />
            <span className="image-selector">
                <div className="image-preview placeholder">No image selected</div>
                <div className="image-preview">
                    <img src={`${axios.defaults.baseURL}${value}`} />
                </div>
                <div className={`text${open_file_browser ? " active" : ""}`} 
                    onClick={() => setOpenFileBrowser(!open_file_browser)}
                >Select image</div>
            </span>
            {open_file_browser ? (
                <FileBrowser open={true} multiple={false}
                    onRefuse={() => setOpenFileBrowser(false)}
                    onClose={() => setOpenFileBrowser(false)}
                    onChange={(selected) => {
                        setOpenFileBrowser(false);
                        onChange(selected);
                    }}
                />
            ) : null}
        </Fragment>
    )
}

function ImageSelector ({ eav_definition, eav_value, state, setState }) {

    const [changeImageFunction, setChangeImageFunction] = useState(null);
    const [image_picker_open, setImagePickerOpen] = useState(false);

    if (eav_definition.html_type === "multiinput" && (!Array.isArray(eav_value.value) || eav_value.value.length === 0)) {
        eav_value.value = [""];
    }

    function webdavToPublicUrl (webdav_url) {
        return  webdav_url.replace("/webdav", "");
    }

    function validateValue (eav_definition, value) {
        let invalid_message;
        let converted_value = valueValidation.convertValue({
            value: value,
            data_type: eav_definition.data_type,
            html_type: eav_definition.html_type
        });
        let validation = valueValidation.validateValue({
            value: converted_value,
            data_type: eav_definition.data_type,
            html_type: eav_definition.html_type,
            validation: eav_definition.validation
        });
        if (value != "" && !validation) {
            invalid_message = (
                <span style={{color: "var(--colorDanger)"}}>
                    <span className="hightlight">{eav_definition.label}</span>
                    <span> must be of type </span>
                    <span className="hightlight">{eav_definition.data_type}</span>
                    {eav_definition.validation ? (
                        <span>
                            <span> and match regex </span>
                            <span class="hightlight">${eav_definition.validation}</span>
                            <span>!</span>
                        </span>
                    ) : null }
                </span>
            )
        };
        return invalid_message;
    }

    let invalid_message;
    if (eav_definition.html_type !== "multiinput" && !utility.isValueEmpty(eav_value.value)) {
        invalid_message = validateValue(eav_definition, eav_value.value);
    }

    return (
        <div>
            <span className="input_tag left">
                <input disabled title={`${eav_definition.attribute_id} (${eav_definition.data_type})`} type="text" value={eav_definition.label} />
            </span>
            <span className="input_value left"
                style={{width: "calc(100% - 170px)"}}
            >
                {eav_definition.html_type !== "multiinput" ? (
                    <Item value={eav_value.value}
                        onChange={(selected) => {
                            if (selected && selected[0]) {
                                eav_value.value = webdavToPublicUrl(selected[0]);
                                setState({...state});
                            }
                        }}
                    />
                ) : (
                    <Fragment>
                        {eav_value.value.map((v_item, v_index) => {
                            let invalid_message;
                            if (!utility.isValueEmpty(v_item)) {
                                invalid_message = validateValue(eav_definition, v_item);
                            };
                            return (
                                <Fragment key={v_index}>
                                    <div className="input_value"
                                        style={{width: "calc(100% - 30px)", marginTop: "0px"}}
                                    >
                                        <Item value={v_item}
                                            onChange={(selected) => {
                                                if (selected && selected[0]) {
                                                    eav_value.value[v_index] = webdavToPublicUrl(selected[0]);
                                                    setState({...state});
                                                }
                                            }}
                                        />
                                        <div className={`alert_message${invalid_message ? " hide" : ""}`}>{invalid_message}</div>
                                    </div>
                                     {eav_value.value.length > 1 ? (
                                        <Clear className="multiinput_remove" onClick={() => {
                                            eav_value.value.splice(v_index, 1);
                                            setState({...state});
                                        }} />
                                    ): null}
                                     <br />
                                </Fragment>
                            )
                        })}
                        <Add className="multiinput_add" onClick={() => {
                            eav_value.value.push("");
                            setState({...state});
                        }} />
                    </Fragment>
                )}
                {eav_definition.html_type !== "multiinput" ? (
                    <div className={`alert_message${invalid_message ? " hide" : ""}`}>{invalid_message}</div>
                ) : null}
            </span>
        </div>
    )
}

export default ImageSelector;