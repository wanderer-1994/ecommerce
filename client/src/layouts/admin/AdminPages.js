import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Product from "./adminPages/Product";
import Order from "./adminPages/Order";
import OrderImport from "./adminPages/OrderImport";
import Warranty from "./adminPages/Warranty";
import Category from "./adminPages/Category";
import UserManagement from "./adminPages/UserManagement";
import AdminManagement from "./adminPages/AdminManagement";

class AdminPages extends React.Component {

  render() {
    return (
        <React.Fragment>
          <Switch>
            <Route path="/admin/product" component={Product} />
            <Route path="/admin/order" component={Order} />
            <Route path="/admin/order-import" component={OrderImport} />
            <Route path="/admin/warranty" component={Warranty} />
            <Route path="/admin/category" component={Category} />
            <Route path="/admin/user-management" component={UserManagement} />
            <Route path="/admin/admin-management" component={AdminManagement} />
            <Redirect to="/admin/order" />
          </Switch>
        </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(AdminPages);