import { connect } from "react-redux";
import { Fragment, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import './App.css';
import routes from "./routes";
import Sidebar from "./components/Sidebar";
import AppLoading from "./components/AppLoading";

function App(props) {
    useEffect(() => {
        setTimeout(() => {
            props.dispatch({
                type: "APPLOADING",
                payload: false
            })
        }, 10)
    })
    return (
        <Fragment>
            <AppLoading/>
            <Route path="*" component={Sidebar} />
            <div className="main">
                <Switch>
                    {
                        routes.map((item, index) =>  
                        <Route exact key={index} path={item.path} render={
                            () => <item.component title={item.title || ""} />
                        } />)
                    }
                </Switch>
            </div>
        </Fragment>
    );
}

function mapStateToProps (state) {
    return {
        appLoading: state.appLoading
    }
}

export default connect(mapStateToProps)(App);
