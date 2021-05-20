import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as webdavAPI from "../api/webdavAPI";
import $ from "jquery";
import "./Webdav.css";
import CustomContextMenu from "../components/CustomContextMenu";
import FileUploader from "../components/FileUploader";
import * as appFunction from "../utils/appFunction";

function Webdav (props) {

    const [item_list, setItemList] = useState([]);
    const [icon_set, setIconSet] = useState({});
    const [path_exist, setPathExist] = useState(true);
    const [context_menu_items, setContextMenuItem] = useState([]);
    const [context_menu_position, setContextMenuPosition] = useState({});
    const [action, setAction] = useState("");
    const [choosen_files, setChoosenFiles] = useState(null);

    useEffect(() => {
        listDirectory();
    }, [props.location.pathname]);

    useEffect(() => {
        $(document).on("contextmenu.webdav", function (event) {
            if ($(event.target).hasClass("webdav")) {
                event.preventDefault();
                let custom_menu_items = [
                    {
                        content: "New folder",
                        onClick: function () {setAction("mkdir")}
                    },
                    {
                        content: "Upload file",
                        onClick: function () {setAction("file_upload")}
                    },
                    {
                        content: "Upload multiple files",
                        onClick: function () {setAction("file_upload_multiple")}
                    }
                ];
                setContextMenuItem(custom_menu_items);
                setContextMenuPosition({
                    left: event.clientX,
                    top: event.clientY
                })
            }
        });
        $(document).on("click.webdav", function (event) {
            if (event.which === 1) {
                setContextMenuItem([]);
            };
        });
        return () => {
            $(document).off("contextmenu.webdav");
            $(document).off("click.webdav");
        }
    }, [])

    function listDirectory () {
        webdavAPI.listDirectory(props.location.pathname.replace(/\/$/, ""))
        .then(data => {
            if (data) {
                setItemList(data.item_list || []);
                delete data.item_list;
                setIconSet(data);
                if (data.path_exist === false) {
                    setPathExist(false);
                } else {
                    setPathExist(true);
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    async function submitCreateDirectory (event) {
        try {
            let dir_name = $(event.target).parent().children("input").val();
            setAction("");
            let data = await webdavAPI.mkdir(props.location.pathname.replace(/\/$/, "") + "/" + dir_name);
            if (data.isSuccess) {
                listDirectory();
            } else {
                appFunction.appAlert({
                    icon: "warning",
                    title: <div>Error creating folder!</div>,
                    message: <div style={{whiteSpace: "pre-line"}}>{data.err_message}</div>,
                    showConfirm: true,
                    submitTitle: "OK"
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function handleDeleteItem (item) {
        try {
            let item_type = "item";
            if (item.is_file) item_type = "file";
            if (item.is_directory) item_type = "folder";
            appFunction.appAlert({
                icon: "warning",
                title: <span>{`Confirm delete ${item_type}: `}<span style={{color: "green", fontStyle: "italic", textDecoration: "underline"}}>{item.name}</span></span>,
                message: `${item_type} ${item.name} could not be recovered after deleted.`,
                showConfirm: true,
                submitTitle: "OK",
                cancelTitle: "Cancel",
                onClickSubmit: async () => {
                    let item_path = props.location.pathname.replace(/\/$/, "") + `/${item.name}`;
                    let result = await webdavAPI.deleteItem(item_path);
                    if (result.isSuccess) {
                        appFunction.appAlert({
                            icon: "success",
                            title: "Success!",
                            message: `${item_type} ${item.name} deleted!`,
                            timeOut: 500
                        });
                        listDirectory();
                    } else {
                        appFunction.appAlert({
                            icon: "danger",
                            title: "Action incomplete!",
                            message: result.err_message,
                            showConfirm: true,
                            submitTitle: "OK",
                        })
                    }
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUpload () {
        try {
            let formData = new FormData();
            formData.append("action", "upload");
            if (choosen_files) {
                for (let i = 0; i < choosen_files.length; i++) {
                    formData.append(i, choosen_files[i]);
                }
            }
            setAction("");
            setChoosenFiles(null);
            let result = await webdavAPI.uploadFiles(props.location.pathname.replace(/\/$/, ""), formData);
            listDirectory();
        } catch (err) {
            console.log(err);
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
                            <span className="path-item" path={item_path} onClick={() => props.history.push(item_path)}>{item}</span>
                        </span>
                    )
                })}
            </Fragment>
        )
    }

    function renderItem (item, index) {
        let bg_img = "";
        bg_img = item.is_file ? icon_set.icon_file : bg_img;
        bg_img = item.is_directory ? icon_set.icon_directory : bg_img;
        if (item.is_file) {
            return (
                <div key={index} className="item" >
                    <a className="link" target="blank"
                        href={`http://localhost:5000/api${window.location.pathname}/${item.name}`}
                    >
                        <span className="icon" style={{backgroundImage: `url(${bg_img})`}}></span>
                        <span className="name">{item.name}</span>
                    </a>
                    <div className="delete" style={{backgroundImage: `url(${icon_set.icon_delete})`}}
                        onClick={() => handleDeleteItem(item)}
                    ></div>
                </div>
            )
        };
        
        if (item.is_directory) {
            return (
                <div key={index} className="item" >
                    <Link className="link" to={props.location.pathname.replace(/\/$/, "") + "/" + item.name}>
                        <span className="icon" style={{backgroundImage: `url(${bg_img})`}}></span>
                        <span className="name">{item.name}</span>
                    </Link>
                    <div className="delete" style={{backgroundImage: `url(${icon_set.icon_delete})`}}
                        onClick={() => handleDeleteItem(item)}
                    ></div>
                </div>
            )
        };

        return (
            <div key={index} className="item">
                <span className="icon" style={{backgroundImage: `url(${bg_img})`}}></span>
                <span className="name">{item.name}</span>
                <div className="delete" style={{backgroundImage: `url(${icon_set.icon_delete})`}}
                    onClick={() => handleDeleteItem(item)}
                ></div>
            </div>
        )
    }

    let total_files = item_list.filter(item => item.is_file).length;
    let total_directories = item_list.filter(item => item.is_directory).length;

    return (
        <Fragment>
            <div className="title">
                <h3>{props.title}</h3>
            </div>
            <div className="content">
                {context_menu_items.length > 0 ? (
                    <CustomContextMenu items={context_menu_items} position={context_menu_position} />
                ) : null}
                {path_exist ? (
                    <div className="webdav">
                        {action === "mkdir" ? (
                            <div className="action">
                                <h4>Folder name</h4>
                                <input type="text" />
                                <button className="save" onClick={(event) => submitCreateDirectory(event)}>Save</button>
                                <button className="cancel" onClick={() => setAction("")}>Cancel</button>
                            </div>
                        ) : null}
                        {action === "file_upload" ? (
                            <div className="action">
                                <FileUploader multiple={false}
                                    onChange={(event) =>  setChoosenFiles(event.target.files)}
                                />
                                <button className="save" onClick={() => handleUpload()}>Save</button>
                                <button className="cancel" onClick={() => {
                                    setAction("");
                                    setChoosenFiles(null);
                                }}>Cancel</button>
                            </div>
                        ) : null}
                        {action === "file_upload_multiple" ? (
                            <div className="action">
                                <FileUploader multiple={true}
                                    onChange={(event) => setChoosenFiles(event.target.files)}
                                />
                                <button className="save" onClick={() => handleUpload()}>Save</button>
                                <button className="cancel" onClick={() => {
                                    setAction("");
                                    setChoosenFiles(null);
                                }}>Cancel</button>
                            </div>
                        ) : null}
                        <h3 className="path-indicator">~{renderPathIndicator(props.location.pathname.replace(/\/$/, ""))}</h3>
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
        </Fragment>
    )
};

export default Webdav;