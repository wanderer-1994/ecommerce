import { Fragment, useEffect } from "react";
import { Route, Switch, Link } from "react-router-dom";
import AppLoading from "./components/Apploading";
import AppAlert from "./components/AppAlert";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Search from "./pages/Search";
import Footer from "./components/Footer";
import PageNotFound from "./pages/PageNotFound";
import constant from "./utils/constant";
import staticPages from "./static_pages/StaticPages";
import store from "./redux/store";
import api from "./api/mockApi";
import appFunction from "./utils/appFunction";

function App() {

    useEffect(() => {
        let identifier = appFunction.addAppLoading();
        api.getCategories().then(data => {
            store.dispatch({
                type: "UPDATE_CATEGORIES",
                payload: data.categories
            });
            store.dispatch({
                type: "UPDATE_STRUCTURIZED_CATEGORIES",
                payload: data.structurized
            });
            appFunction.removeAppLoading(identifier);
        }).catch(err => {
            console.log(err);
            appFunction.removeAppLoading(identifier);
        })
    }, [])

    return (
        <Fragment>
            <AppLoading />
            <AppAlert />
            <Route path="*" component={Navbar} />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/search" component={Search}></Route>
                <Route path="/404" component={PageNotFound}></Route>
                <Route path="/:url" render={(props) => {
                    let url = props.match.params.url;
                    let Component;
                    staticPages.forEach(page => {
                        Component =  page.url === url ? page.component : Component;
                    });
                    if (!Component) {
                        if (url.indexOf(constant.URL_CAT_SPLITER) !== -1) {
                            let categoryId = url.split(constant.URL_CAT_SPLITER).reverse()[0];
                            if (categoryId && categoryId.trim().length > 0) Component = Category;
                        } else if (url.indexOf(constant.URL_PROD_SPLITER) !== -1) {
                            let productId = url.split(constant.URL_PROD_SPLITER).reverse()[0];
                            if (productId && productId.trim().length > 0) Component = Product;
                        }
                    }
                    Component = Component || PageNotFound;
                    return (
                        <Component {...props} />
                    )
                }} />
            </Switch>
            <Footer />
        </Fragment>
    );
}

export default App;
