import { useEffect } from "react";
import { connect } from "react-redux";

function AppAlert (props) {

    return (
        props.appAlert ? (
            <div className="app-alert">
                THIS IS APP ALERT
            </div>
        ) : null
    );
}

function mapStateToProps (state) {
    return {
        appAlert: state.appAlert
    }
}

export default connect(mapStateToProps)(AppAlert);