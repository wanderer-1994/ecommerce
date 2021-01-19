import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import UserProdGroup from "./userPages/UserProdGroup";
import UserProduct from "./userPages/UserProduct";
import PageNotFound from "./userPages/PageNotFound";
import UserGuide from "./userPages/UserGuide";
import UserWarranty from "./userPages/UserWarranty";
import UserCart from "./userPages/UserCart";
import CheckOrder from "./userPages/CheckOrder";

class UserPages extends React.Component {

  render() {
    let component =  PageNotFound;
    switch(this.props.match.params.url){
      case "huong-dan-mua-hang":
        component = UserGuide;
        break;
      case "chinh-sach-bao-hanh":
        component = UserWarranty;
        break;
      case "gio-hang":
        component = UserCart;
        break;
      case "tra-cuu-don-hang":
        component = CheckOrder;
        break;
      case "tim-kiem":
        component = UserProdGroup;
        break;
      default:
        let pageType = this.props.match.params.url.split("_")[1];
        if(pageType && pageType.indexOf && pageType.indexOf("pro") == 0){
          component = UserProduct;
        }else if(pageType && pageType.indexOf && pageType.indexOf("cat") == 0){
          component = UserProdGroup;
        }else{
          component = PageNotFound;
        }
        break;
    }
    
    return (
        <React.Fragment>
          <Switch>
            <Route path="/:url" component={component} />
          </Switch>
        </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(UserPages);