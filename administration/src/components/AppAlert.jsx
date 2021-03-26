import { connect } from "react-redux";
import "./AppAlert.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";

const iconList = [
    { name: "warning", icon: "!" },
    { name: "success", icon: "S" },
    { name: "info", icon: "i" },
    { name: "danger", icon: "!!!" },
]

const appAlertModel = { // eslint-disable-line
    icon: "warning",
    showConfirm: true,
    title: <div style={{color: "red"}}>Title</div>,
    message: <div style={{color: "#ababab"}}>message</div>,
    cancelTitle: <div style={{color: "#ababab"}}>Cancel</div>,
    submitTitle: <div style={{color: "#ffffff"}}>Submit</div>,
    onClickCancel: () => {console.log("cancelled!")},
    onClickSubmit: () => {console.log("submitted!")},
    timeOut: 1000,
    onTimeOut: () => {console.log("time out!")},
}

function AppAlert (props) {
    let appAlert = props.appAlert;

    if (appAlert && appAlert.timeOut) {
        setTimeout(() => {
            $(".app-alert").addClass("inactive");
            setTimeout(() => {
                if (typeof (appAlert.onTimeOut) == "function") appAlert.onTimeOut();
                appFunction.appAlert(null);
            }, 300)
        }, appAlert.timeOut);
    }

    let alertIcon;
    if (appAlert && appAlert.icon) {
        let match = iconList.find(item => item.name === appAlert.icon);
        if (match) alertIcon = match;
    };
    return (
        <div className={`app-alert ${appAlert ? "" : "inactive"}`}>
            <div className="alert-wrapper"
                style={appAlert && appAlert.showConfirm ? { paddingBottom: "55px" } : null}
            >
                <div className={`header ${alertIcon ? alertIcon.name : ""}`}>
                    {alertIcon ? <div className={`icon ${alertIcon.name}`}>{alertIcon.icon}</div> : null}
                    {appAlert && appAlert.title ? <div className="title">{appAlert.title}</div> : null}
                </div>
                {appAlert && appAlert.message ? <div className="message">{appAlert.message}</div> : null}
                {appAlert  &&  appAlert.showConfirm ? (
                    <div className="alert-footer">
                        <button
                            className="cancel"
                            onClick={() => onClickCancel(appAlert)}
                        >{appAlert.cancelTitle || "Thoát"}</button>
                        <button
                            className="submit"
                            onClick={() => onClickSubmit(appAlert)}
                        >{appAlert.submitTitle || "Đồng ý"}</button>
                    </div>
                ) : null}
            </div>
        </div>
    )
};

function onClickCancel (appAlert) {
    $(".app-alert").addClass("inactive");
    setTimeout(() => {
        if (typeof (appAlert.onClickCancel) == "function") appAlert.onClickCancel();
        appFunction.appAlert(null);
    }, 300)
};

function onClickSubmit (appAlert) {
    $(".app-alert").addClass("inactive");
    setTimeout(() => {
        if (typeof (appAlert.onClickSubmit) == "function") appAlert.onClickSubmit();
        appFunction.appAlert(null);
    }, 300)
}

function mapStateToProps (state) {
    return {
        appAlert: state.appAlert
    }
}

export default connect(mapStateToProps)(AppAlert);