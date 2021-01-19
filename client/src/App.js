import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import store from "./redux/store";
import { connect } from "react-redux";
import UserLayout from "./layouts/User";
import AdminLayout from "./layouts/Admin";
import AppLoading from "./layouts/AppLoading";
import AppAlert from "./layouts/AppAlert";
import AdminAuth from "./layouts/AdminAuth";
import { adminAuthenticate } from "./api/apiAdmin";
import axios from "axios";
import { validateCart, accessAnnounce } from "./api/apiCall";

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ori_admin: "",
      admin: {},
    }
  }

  componentDidMount = async () => {
    // subscribe to store change first
    this.unsubscribe = store.subscribe(() => {
      let store_admin = store.getState().admin;
      let store_admin_json = JSON.stringify(store_admin);
      if(this.state.ori_admin != store_admin_json){
        this.setState({
          admin: store_admin,
          ori_admin: store_admin_json
        })
      }
    })

    // admin auth later
    let admin_cookie = localStorage.getItem("admin_cookie");
    if(admin_cookie && admin_cookie != ""  && admin_cookie != "null"){
      axios.defaults.headers.common['Authorization'] = `{"admin_cookie": "${admin_cookie}"}`
      let admin = await adminAuthenticate();
      if(admin.admin_id){
        this.props.dispatch({type: "UPDATE_ADMIN", payload: admin})
      }
    }

    // cart validate
    let cart = localStorage.getItem("cart");
    cart = JSON.parse(cart);
    if(cart && cart.length && cart.length > 0){
      let prod_ids = [];
      cart.forEach(item => {
        prod_ids.push(item.prod_id);
      })
      let products = await validateCart(prod_ids);
      let new_cart = [];
      let isChanged = false;
      cart.forEach(item => {
        let match_item = products.find(server_prod => {return unescape(server_prod.prod_id) == item.prod_id});
        if(match_item){
          new_cart.push(item)
        }else{
          isChanged = true;
        };
      })
      if(isChanged){
        this.props.dispatch({type: "UPDATE_CART", payload: new_cart});
        localStorage.setItem("cart", JSON.stringify(new_cart));
      }
    }

    // user access record
    if(!admin_cookie){
      let machine_key = localStorage.getItem("machine_key");
      if(!machine_key || machine_key == ""){
        machine_key = Date.now();
        let last_access = machine_key;
        localStorage.setItem("machine_key", machine_key);
        localStorage.setItem("last_access", last_access);
        await accessAnnounce(machine_key, last_access);
      }else{
        let last_access = localStorage.getItem("last_access");
        let cur_time = Date.now();
        if(isNaN(parseInt(last_access))){
          last_access = 0;
        }
        if(cur_time - parseInt(last_access) > 2*60*60*1000){ // two hours
          localStorage.setItem("last_access", cur_time);
          await accessAnnounce(machine_key, cur_time);
        }
      }
    }
  }

  componentWillUnmount = () => this.unsubscribe();

  render = () => {
    let { admin } =  this.state;
    return (
      <React.Fragment>
        {this.props.appLoading ? <AppLoading /> : null}
        <AppAlert />
        <Switch>
          <Route path="/admin-auth" component={AdminAuth} />
          {admin && admin.admin_id ? (
            <Route path="/admin" component={AdminLayout} />
          ) : null}
          <Route path="/" component={UserLayout} />
        </Switch>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state){
  return {
    appLoading: state.appLoading,
    appAlert: state.appAlert,
    admin: state.admin
  }
}

export default connect(mapStateToProps)(App);