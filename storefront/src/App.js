import { Fragment } from "react";
import { Route, Switch, Link } from "react-router-dom";
import AppLoading from "./components/Apploading";
import AppAlert from "./components/AppAlert";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Search from "./pages/Search";
import Footer from "./components/Footer";
import PageNotFound from "./pages/PageNotFound";

function App() {
    return (
        <Fragment>
            <Link to="/">Home</Link>
            <Link to="/prod">Product</Link>
            <Link to="/cat">Cateogry</Link>
            <Link to="/search">Search</Link>
            <Link to="/404">404</Link>
            <Link to="/abc">Others</Link>
            <AppLoading />
            <AppAlert />
            <Menu />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/prod" component={Product}></Route>
                <Route path="/cat" component={Category}></Route>
                <Route path="/search" component={Search}></Route>
                <Route path="/404" component={PageNotFound}></Route>
                <Route path="/:url" render={() => {
                    return (
                        <div className="other-page">
                            THIS IS OTHER PAGE
                        </div>
                    )
                }} />
            </Switch>
            <Footer />
        </Fragment>
    );
}

export default App;
