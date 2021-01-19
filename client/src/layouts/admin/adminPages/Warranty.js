import React from "react";
import { connect } from "react-redux";
import { appLoading } from "../../../utils/appFunction";

class Warranty extends React.Component {

  componentDidMount = () => {
    appLoading(false);
  }

  render() {
    return (
      <React.Fragment>
        Warranty
      </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(Warranty);