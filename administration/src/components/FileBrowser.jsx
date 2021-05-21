import "./FileBrowser.css";
import { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import * as webdavAPI from "../api/webdavAPI";
import $ from "jquery";
import utility from "../utils/utility";

function FileBrowser (props) {

    const [instanceUUID, setInstanceUUID] = useState(null);
    const [fileBrowserInstancesState, setFileBrowserInstancesState] = useState([]);

    const [item_list, setItemList] = useState([]);
    const [icon_set, setIconSet] = useState({});
    const [path_exist, setPathExist] = useState(true);
    const [webdav_path, setWebdavPath] = useState("");
    const [selected, setSelected] = useState([]);
    const [search_phrase, setSearchPhrase] = useState("");

    useEffect(() => {
        let timestamp_uuid = Date.now().toString();
        setInstanceUUID(timestamp_uuid);

        // persist previous experiences
        let persist_webdav_search_phrase = localStorage.getItem("webdav_search_phrase");
        if (utility.isValueEmpty(persist_webdav_search_phrase)) {
            persist_webdav_search_phrase = "";
        };
        setSearchPhrase(persist_webdav_search_phrase);

        let persist_webdav_path = localStorage.getItem("webdav_path");
        if (!persist_webdav_path || persist_webdav_path.indexOf("/webdav") === -1) {
            persist_webdav_path = "/webdav";
        };
        setWebdavPath(persist_webdav_path);

        $(document).on("keydown.escape_file_browser", function (event) {
            if (event.key === "Escape" && !event.ctrlKey && !event.altKey) {
                props.onClose();
            }
        });
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
            };
            $(document).off("keydown.escape_file_browser");
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
        if (!utility.isValueEmpty(webdav_path)) {
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
                        localStorage.setItem("webdav_path", webdav_path);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
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
            let public_path = utility.webdavToPublicUrl(webdav_path + "/" + item.name);
            let public_path_with_host = utility.toPublicUrlWithHost(public_path);
            return (
                <div key={index} className="item">
                    <div className={`link type-file${is_selected ? " selected" : ""}`}
                        data-url={webdav_path + "/" + item.name}
                        // Again, using useEffect with jquery issuing not updating variable when search_phrase is changed!
                        onMouseEnter={(event) => {
                            $(".modal-content .image-preview").addClass("active");
                            $(".modal-content .image-preview").css({
                                "top": `${event.clientY - 110}px`,
                                "left": `${event.clientX}px`
                            });
                            $(".modal-content .image-preview img").attr("src", public_path_with_host);
                        }}
                        onMouseLeave={() => {
                            $(".modal-content .image-preview").removeClass("active");
                            $(".modal-content .image-preview img").attr("src", "");
                        }}
                        onDoubleClick={() => {
                            window.open(public_path_with_host, "_blank");
                        }}
                        onClick={() => {
                            let new_selected = [];
                            if (item_idx === -1) {
                                if (props.c_multiple) {
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
    let search_items = [...item_list];
    if (!utility.isValueEmpty(search_phrase)) {
        search_items = item_list.filter(item => item.name && item.name.toLowerCase().indexOf(search_phrase.toLowerCase()) !== -1);
    }

    return (
        <Fragment>
            {props.open && instanceUUID && fileBrowserInstancesState && fileBrowserInstancesState.indexOf(instanceUUID) != -1 ? (
                <div className="modal-bgr">
                    <div className="file-browser modal-cover">
                        <div className="modal-header">Select file</div>
                        <div className="modal-content">
                            <div className="image-preview">
                                <img src="" />
                            </div>
                        {path_exist ? (
                            <div className="webdav active">
                                <div className="header">
                                    <h3 className="path-indicator">~{renderPathIndicator(webdav_path)}</h3>
                                    <div className="search">
                                        <input type="text" value={search_phrase} onChange={(event) => {
                                            setSearchPhrase(event.target.value);
                                            localStorage.setItem("webdav_search_phrase", event.target.value);
                                        }} />
                                    </div>
                                </div>
                                <div className="count">{item_list.length} items - {total_directories} folders - {total_files} files</div>
                                {search_items.map((item, index) => {
                                    return renderItem(item, index);
                                })}
                            </div>
                        ) : (
                            <div className="webdav inactive">
                                <h3 className="path-indicator">~{renderPathIndicator(webdav_path)}</h3>
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