import { connect } from "react-redux";
import "./AppAlert.css";

function AppAlert (props) {
    return (
        <div className={`app-alert ${props.appAlert ? "" : "inactive"}`}>App alert</div>
    )
};

function mapStateToProps (state) {
    return {
        appAlert: state.appAlert
    }
}

export default connect(mapStateToProps)(AppAlert);