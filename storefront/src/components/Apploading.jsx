import { useState, useEffect } from "react";
import { connect } from "react-redux"

function AppLoading (props) {
    
    return (
        props.appLoading && props.appLoading.length > 0 ? (
            <div className="app-loading">
                THIS IS APP LOADING {props.appLoading}
            </div>
        ) : null
    );
}

function mapStateToProps (state) {
    return {
        appLoading: state.appLoading
    }
}

export default connect(mapStateToProps)(AppLoading);