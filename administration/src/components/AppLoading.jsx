import "./AppLoading.css";
import { connect } from "react-redux";

function AppLoading (props) {
    return (
        <div className={`app-loading ${props.appLoading ? "" : "inactive"}`}>LOADING...</div>
    )
}

function mapStateToProps (state) {
    return {
        appLoading: state.appLoading
    }
}

export default connect(mapStateToProps)(AppLoading);