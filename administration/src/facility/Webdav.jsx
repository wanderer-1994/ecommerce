import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as webdavAPI from "../api/webdavAPI";
import "./Webdav.css";

function Webdav (props) {

    const [item_list, setItemList] = useState([]);
    const [icon_directory, setIconDirectory] = useState("");
    const [icon_file, setIconFile] = useState("");

    useEffect(() => {
        webdavAPI.listDirectory(window.location.pathname)
        .then(data => {
            if (data) {
                setItemList(data.item_list || []);
                setIconDirectory(data.icon_directory || "");
                setIconFile(data.icon_file || "");
            }
        })
        .catch(err => {
            console.log(err);
        })
    }, [props.location.pathname])

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

    return (
        <Fragment>
            <div className="title">
                <h3>{props.title}</h3>
                <button className="success float large"
                    onClick={() => console.log("clicked")}
                >Upload</button>
            </div>
            <div className="content webdav">
                <h3 className="path-indicator">~{props.location.pathname}</h3>
                {item_list.map((item, index) => {
                    return renderItem(item, index);
                })}
            </div>
        </Fragment>
    )
};

export default Webdav;