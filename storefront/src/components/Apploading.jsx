import { useState, useEffect } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import "./AppLoading.css";

function AppLoading (props) {

    useEffect(() => {
        if (props.appLoading.length > 0) {
            $("body").css({
                overflow: "hidden"
            });
            $("body").data({
                appLoading: 1
            }); 
        } else {
            let isControlled = $("body").data("appLoading");
            if (isControlled) {
                $("body").data({
                    appLoading: undefined
                }); 
                $("body").css({
                    overflow: ""
                });
            };
        }
    }, [props.appLoading]);
    
    return (
        props.appLoading && props.appLoading.length > 0 ? (
            <div className="app-loading">
                THIS IS APP LOADING
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