import React from "react";
import { connect } from "react-redux";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import store from "../redux/store";
import "./AppAlert.css";
import { open_appAlert } from "../utils/appFunction";
import $ from "jquery";

const iconList = [
    { name: "warning", icon: "!" },
    { name: "success", icon: "S" },
    { name: "info", icon: "i" },
    { name: "danger", icon: "!!!" },
]

class AppAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appAlert: null
        }
    }

    // appAlert state config
    // icon: string,
    // showConfirm: boolean,
    // title: React.Component,
    // message: React.Component,
    // onClickCancel: () => {} - function,
    // onClickSubmit: () => {} - function,
    // timeOut: 2000 - number,
    // onTimeOut: () => {console.log("onTimeOut") - function}
    // cancelTitle: string,
    // submitTitle: string

    componentDidMount = () => {
        this.unsubscribe = store.subscribe(() => {
            let appAlert = store.getState().appAlert;
            this.setState({ appAlert: appAlert });
        })
    }

    componentWillUnMount = () => {
        this.unsubscribe();
    }

    onClickCancel = appAlert => {
        open_appAlert(null);
        if (typeof (appAlert.onClickCancel) == "function") appAlert.onClickCancel();
    }

    onClickSubmit = appAlert => {
        open_appAlert(null);
        if (typeof (appAlert.onClickSubmit) == "function") appAlert.onClickSubmit();
    }

    render() {
        let appAlert = this.state.appAlert;
        if (appAlert && appAlert.timeOut) {
            setTimeout(() => {
                open_appAlert(null);
                if (typeof (appAlert.onTimeOut) == "function") appAlert.onTimeOut();
            }, appAlert.timeOut);
        }
        let icon;
        if (appAlert && appAlert.icon) {
            let match_icon = iconList.find(item => { return item.name == appAlert.icon });
            if (match_icon) icon = match_icon.icon;
        }
        return (
            <React.Fragment>
                {appAlert ? (
                    <div className="appAlert">
                        <div
                            className="appAlertWrapper"
                            style={appAlert.showConfirm ? { paddingBottom: "55px" } : null}
                        >
                            <div className="header">
                                {icon ? <div className="icon">{icon}</div> : null}
                                {appAlert.title ? <div className="title">{appAlert.title}</div> : null}
                                {appAlert.message ? <div className="message">{appAlert.message}</div> : null}
                            </div>
                            {appAlert.showConfirm ? (
                                <div className="appAlertFooter">
                                    <button
                                        className="cancel"
                                        onClick={() => this.onClickCancel(appAlert)}
                                    >{appAlert.cancelTitle || "Thoát"}</button>
                                    <button
                                        className="submit"
                                        onClick={() => this.onClickSubmit(appAlert)}
                                    >{appAlert.submitTitle || "Đồng ý"}</button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        appAlert: state.appAlert
    }
};

export default connect(mapStateToProps)(AppAlert);