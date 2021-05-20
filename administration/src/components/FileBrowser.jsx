import "./FileBrowser.css";
import { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import * as webdavAPI from "../api/webdavAPI";

let persist_webdav_path = "/webdav";

function FileBrowser (props) {

    const [instanceUUID, setInstanceUUID] = useState(null);
    const [fileBrowserInstancesState, setFileBrowserInstancesState] = useState([]);

    const [item_list, setItemList] = useState([]);
    const [icon_set, setIconSet] = useState({});
    const [path_exist, setPathExist] = useState(true);
    const [webdav_path, setWebdavPath] = useState(persist_webdav_path);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        let timestamp_uuid = Date.now().toString();
        setInstanceUUID(timestamp_uuid);
        return function () {
            let fileBrowserInstances = props.fileBrowserInstances;
            // USE timestamp_uuid not instanceUUID eventhough timestamp_uuid = instanceUUID
            // Because useEffect cleaning function get first assigned value instanceUUID which is null
            // Even later instanceUUID is set to some other value, but the first value will kept, which is null
            let index = fileBrowserInstances.indexOf(timestamp_uuid);
            if (index !== -1) {
                fileBrowserInstances.splice(index, 1);
                props.dispatch({
                    type: "FILE_BROWSER_INSTANCE",
                    payload: fileBrowserInstances
                });
            }
        }
    }, [])

    useEffect(() => {
        if (props.open) {
            let fileBrowserInstances = props.fileBrowserInstances
            if (!fileBrowserInstances) fileBrowserInstances = [];
            if (fileBrowserInstances.length === 0 && instanceUUID) {
                fileBrowserInstances.push(instanceUUID);
                props.dispatch({
                    type: "FILE_BROWSER_INSTANCE",
                    payload: fileBrowserInstances
                });
                setFileBrowserInstancesState(fileBrowserInstances);
            } else if (instanceUUID && fileBrowserInstances && fileBrowserInstances[0] && fileBrowserInstances[0] !== instanceUUID) {
                window.alert("Could not instantiate File browser because another instance is running!");
                if (typeof(props.onRefuse) === "function") {
                    props.onRefuse();
                }
            }
            
        };
        if (!props.open) {
            let fileBrowserInstances = props.fileBrowserInstances;
            let index = fileBrowserInstances.indexOf(instanceUUID);
            if (index !== -1) {
                fileBrowserInstances.splice(index, 1);
                props.dispatch({
                    type: "FILE_BROWSER_INSTANCE",
                    payload: fileBrowserInstances
                });
                setFileBrowserInstancesState(fileBrowserInstances);
            }
        };
    }, [props.open, instanceUUID])

    useEffect(() => {
        listDirectory();
        setSelected([]);
    }, [webdav_path])

    function listDirectory () {
        webdavAPI.listDirectory(webdav_path.replace(/\/$/, ""))
        .then(data => {
            if (data) {
                setItemList(data.item_list || []);
                delete data.item_list;
                setIconSet(data);
                if (data.path_exist === false) {
                    setPathExist(false);
                } else {
                    setPathExist(true);
                    persist_webdav_path = webdav_path;
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    function renderPathIndicator (path) {
        if (typeof(path) !== "string") return path;
        let list = path.split("/");
        return (
            <Fragment>
                {list.map((item, index) => {
                    if (index === 0) return null;
                    let item_path = list.slice(0, index + 1);
                    item_path = item_path.join("/");
                    return (
                        <span key={index}>
                            <span>/</span>
                            <span className="path-item" path={item_path} onClick={() => setWebdavPath(item_path)}>{item}</span>
                        </span>
                    )
                })}
            </Fragment>
        )
    }

    function renderItem (item, index) {
        let item_icon = "";
        item_icon = item.is_file ? icon_set.icon_file : item_icon;
        item_icon = item.is_directory ? icon_set.icon_directory : item_icon;

        if (item.is_directory) {
            return (
                <div key={index} className="item">
                    <div className="link"
                        onClick={() => setWebdavPath(webdav_path + "/" + item.name)}
                    >
                        <span className="icon" style={{backgroundImage: `url(${item_icon})`}}></span>
                        <span className="name">{item.name}</span>
                    </div>
                </div>
            )
        } else {
            let item_full_path = webdav_path + "/" + item.name;
            let item_idx = selected.indexOf(item_full_path);
            let is_selected = item_idx === -1 ? false : true;
            return (
                <div key={index} className="item">
                    <div className={`link${is_selected ? " selected" : ""}`}
                        onClick={() => {
                            let new_selected = [];
                            if (item_idx === -1) {
                                if (props.multiple) {
                                    new_selected = [...selected, item_full_path];
                                } else {
                                    new_selected = [item_full_path];
                                }
                            } else {
                                selected.splice(item_idx, 1);
                                new_selected = [...selected];
                            };
                            setSelected(new_selected);
                        }}
                    >
                        <span className="icon" style={{backgroundImage: `url(${item_icon})`}}></span>
                        <span className="name">{item.name}</span>
                    </div>
                </div>
            )
        }
    }

    let total_files = item_list.filter(item => item.is_file).length;
    let total_directories = item_list.filter(item => item.is_directory).length;

    return (
        <Fragment>
            {props.open && instanceUUID && fileBrowserInstancesState && fileBrowserInstancesState.indexOf(instanceUUID) != -1 ? (
                <div className="modal-bgr">
                    <div className="file-browser modal-cover">
                        <div className="modal-header">Select file</div>
                        <div className="modal-content">
                        {path_exist ? (
                            <div className="webdav">
                                <h3 className="path-indicator">~{renderPathIndicator(webdav_path)}</h3>
                                <div className="count">{item_list.length} items - {total_directories} folders - {total_files} files</div>
                                {item_list.map((item, index) => {
                                    return renderItem(item, index);
                                })}
                            </div>
                        ) : (
                            <div className="webdav-inactive">
                                Webdav path not exists!
                            </div>
                        )}
                        </div>
                        <div className="modal-footer">
                            <button className="modal-button cancel"
                                onClick={props.onClose}
                            >Cancel</button>
                            <button className="modal-button submit"
                                onClick={() => props.onChange(selected)}
                            >Submit</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </Fragment>
    )
}

function mapStateToProps (state) {
    return {
        fileBrowserInstances: state.fileBrowserInstances
    }
} 

export default connect(mapStateToProps)(FileBrowser);