import React from "react";
import { appLoading } from "../../../utils/appFunction";
import "./PageNotFound.css";

class PageNotFound extends React.Component {

    componentDidMount = () => {
        appLoading(false);
    }

    render() {
        return (
            <React.Fragment>
                <div className="PageNotFound">
                    <p>404 err: không tìm thấy trang</p>
                    <button onClick={() => this.props.history.goBack()}>quay trở lại</button>
                </div>
            </React.Fragment>
        );
    }
};

export default (PageNotFound);