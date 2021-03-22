import { useEffect } from "react";
import { connect } from "react-redux"

function AppLoading ({ appLoading, dispatch }) {
    useEffect(() => {
        setTimeout(() => {
            dispatch({
                type: "UPDATE_APPLOADING",
                payload: false
            })
        }, 5000)
    }, []);
    
    return (
        appLoading ? 
        <div className="app-loading">
            THIS IS APP LOADING
        </div>
        : null
    );
}

function mapStateToProps (state) {
    return {
        appLoading: state.appLoading
    }
}

export default connect(mapStateToProps)(AppLoading);