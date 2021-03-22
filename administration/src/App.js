import { Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import './App.css';
import routes from "./routes";
import Sidebar from "./components/Sidebar";

function App() {
    return (
        <Fragment>
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

export default App;
