import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as webdavAPI from "../api/webdavAPI";
import $ from "jquery";
import "./Webdav.css";
import CustomContextMenu from "../components/CustomContextMenu";
import Clear from "@material-ui/icons";
import * as appFunction from "../utils/appFunction";

function Webdav (props) {

    const [item_list, setItemList] = useState([]);
    const [icon_directory, setIconDirectory] = useState("");
    const [icon_file, setIconFile] = useState("");
    const [path_exist, setPathExist] = useState(true);
    const [context_menu_items, setContextMenuItem] = useState([]);
    const [context_menu_position, setContextMenuPosition] = useState({});
    const [action, setAction] = useState("");

    useEffect(() => {
        webdavAPI.listDirectory(props.location.pathname)
        .then(data => {
            if (data) {
                setItemList(data.item_list || []);
                setIconDirectory(data.icon_directory || "");
                setIconFile(data.icon_file || "");
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

    function renderItem (item, index) {
        let bg_img = "";
        bg_img = item.is_file ? icon_file : bg_img;
        bg_img = item.is_directory ? icon_directory : bg_img;
        if (item.is_file) {
            return (
                <a key={index} className="item" target="blank"
                   href={`http://localhost:5000/api${window.location.pathname}/${item.name}`}
                >
                    <span className="icon" style={{backgroundImage: `url(${bg_img})`}}></span>
                    <span className="name">{item.name}</span>
                </a>
            )
        };
        
        if (item.is_directory) {
            return (
                <Link key={index} className="item" to={props.location.pathname + "/" + item.name}>
                    <span className="icon" style={{backgroundImage: `url(${bg_img})`}}></span>
                    <span className="name">{item.name}</span>
                </Link>
            )
        };

        return (
            <div key={index} className="item">
                <span className="icon" style={{backgroundImage: `url(${bg_img})`}}></span>
                <span className="name">{item.name}</span>
            </div>
        )
    }

    async function submitCreateDirectory (event) {
        try {
            let dir_name = $(event.target).parent().children("input").val();
            setAction("");
            let data = await webdavAPI.mkdir(props.location.pathname, dir_name);
            if (data.isSuccess) {
                webdavAPI.listDirectory(props.location.pathname)
                .then(data => {
                    if (data) {
                        setItemList(data.item_list || []);
                        setIconDirectory(data.icon_directory || "");
                        setIconFile(data.icon_file || "");
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
                                <button className="cancel" onClick={(event) => setAction("")}>Cancel</button>
                            </div>
                        ) : null}
                        <h3 className="path-indicator">~{props.location.pathname}</h3>
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