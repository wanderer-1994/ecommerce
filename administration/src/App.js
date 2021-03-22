import { Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import './App.css';
import routes from "./routes";
import Sidebar from "./components/Sidebar";

function App() {
    return (
        <Fragment>
            <Sidebar />
            <div className="main" style={{"--width": "230px"}}>
                <Switch>
                    {routes.map((item, index) =>  <Route exact key={index} path={item.path} component={item.component} />)}
                </Switch>
            </div>
        </Fragment>
    );
}

export default App;
