import "./FileUploader.css";
import { useEffect } from "react";
import $ from "jquery";

function FileUploader (props) {
    return (
        <div className="file-uploader">
            <button
                onClick={() => $(".file-uploader input").trigger("click")}
            >Choose file</button>
            <input type="file" {...props}
                onChange={event => {
                    if (typeof(props.onChange) === "function") {
                        props.onChange(event);
                    }
                }}
            />
        </div>
    )
}

export default FileUploader;