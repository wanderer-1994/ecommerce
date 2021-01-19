import React from "react";
import store from "../../redux/store";
import { connect } from "react-redux";
import Menu from "@material-ui/icons/Menu";
import "./AdminNavbar.css";
import { toggleAdminSidebar } from "../../utils/functions";

class AdminNavbar extends React.Component {
  render() {
    return (
      <div className="AdminNavbar">
        <Menu
          className="adminMobileMenu"
          onClick={() => toggleAdminSidebar()}
        />
      </div>
    );
  }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(AdminNavbar);