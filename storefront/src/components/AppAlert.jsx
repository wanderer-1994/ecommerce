import { useEffect } from "react";
import { connect } from "react-redux";

function AppAlert ({ appAlert, dispatch }) {
    useEffect(() => {
        setTimeout(() => {
            dispatch({
                type: "UPDATE_APP_ALERT",
                payload: null
            })
        }, 5000)
    });
    return (
        appAlert ? 
        <div className="app-alert">
            THIS IS APP ALERT
        </div>
        : null
    );
}

function mapStateToProps (state) {
    return {
        appAlert: state.appAlert
    }
}

export default connect(mapStateToProps)(AppAlert);