import React from "react";
import { connect } from "react-redux";
import { appLoading } from "../../../utils/appFunction";

class UserGuide extends React.Component {

  componentDidMount = () => {
    appLoading(false);
  }

  render() {
    return (
      <React.Fragment>
        Heyoo!<br></br>
        Hướng dẫn mua hàng chưa được cập nhật. <br></br>
        Shop sẽ cập nhật thông tin sớm nhất có thể!
      </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(UserGuide);