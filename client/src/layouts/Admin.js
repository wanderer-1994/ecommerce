import React from "react";
import store from "../redux/store";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminSidebar from "./admin/AdminSidebar";
import AdminNavbar from "./admin/AdminNavbar";
import AdminPages from "./admin/AdminPages";
import Footer from "./user/UserFooter";
import "./Admin.css";

class Admin extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          admin: this.props.admin,
      }
  }

  componentDidMount = () => {
    // store.dispatch({type: "UPDATE_APPLOADING", payload: 0});
  }

  render() {
    return (
      <div className="AdminLayout">
        <AdminNavbar />
        <Route path="*" component={AdminSidebar}></Route>
        <div className="AdminWrapper">
          <Route path="/admin" component={AdminPages} />
          <Footer/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
    return {
        admin: state.admin,
    }
};

export default connect(mapStateToProps)(Admin);