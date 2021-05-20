import { useState, Fragment } from "react";
import * as valueValidation from "../objectModels/eav/valueValidation";
import $ from "jquery";
import Clear from "@material-ui/icons/Clear";
import Add from "@material-ui/icons/Add";
import utility from "../utils/utility";
import FileBrowser from "../components/FileBrowser";
import "./ImageSelector.css";

function Item ({ value, onChange }) {
    const [open_file_browser, setOpenFileBrowser] = useState(false);
    return (
        <Fragment>
            <input className="multiinput_item" disabled type="text" value={value} style={{width: "calc(100% - 120px)"}} />
            <span className="image-selector">
                <div className="image-preview placeholder">No image selected</div>
                <div className="image-preview">
                    <img src={`http://localhost:5000${value}`} />
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
                            return (
                                <Fragment key={v_index}>
                                     <Item value={v_item}
                                        onChange={(selected) => {
                                            if (selected && selected[0]) {
                                                eav_value.value[v_index] = webdavToPublicUrl(selected[0]);
                                                setState({...state});
                                            }
                                        }}
                                     />
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
                <div className="alert_message hide"></div>
            </span>
        </div>
    )
}

export default ImageSelector;