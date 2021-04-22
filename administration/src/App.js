import { connect } from "react-redux";
import { Fragment, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import './App.css';
import routes from "./routes";
import Sidebar from "./components/Sidebar";
import AppLoading from "./components/AppLoading";
import AppAlert from "./components/AppAlert";
import * as appFunction from "./utils/appFunction";
import "antd/dist/antd.css";

function App(props) {
    useEffect(() => {
        setTimeout(() => {
            appFunction.appLoading(false);
        }, 10)
    })
    return (
        <Fragment>
            <AppLoading/>
            <AppAlert/>
            <Route path="*" component={Sidebar} />
            <div className="main">
                <Switch>
                    {
                        routes.map((item, index) =>  
                        <Route exact key={index} path={item.path} render={
                            (props) => <item.component {...props} title={item.title || ""} />
                        } />)
                    }
                </Switch>
            </div>
        </Fragment>
    );
}

function mapStateToProps (state) {
    return {}
}

export default connect(mapStateToProps)(App);
