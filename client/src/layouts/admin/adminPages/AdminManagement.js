import React from "react";
import { connect } from "react-redux";
import { appLoading } from "../../../utils/appFunction";

class AdminManagement extends React.Component {

  componentDidMount = () => {
    appLoading(false);
  }

  render() {
    return (
      <React.Fragment>
        AdminManagement
      </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(AdminManagement);