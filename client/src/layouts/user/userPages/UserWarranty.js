import React from "react";
import { connect } from "react-redux";
import { appLoading } from "../../../utils/appFunction";

class UserWarranty extends React.Component {

  componentDidMount = () => {
    appLoading(false);
  }

  render() {
    return (
      <React.Fragment>
        Heyoo!<br></br>
        Tất cả các sản phẩm ở shop đều được bảo hành theo như thông tin chi tiết của sản phẩm.<br/>
        Thông tin bảo hành chi tiết hơn thì shop sẽ cập nhật sớm nhất có thể để khách yên tâm mua hàng nha!<br></br>
        Hiện tại, nếu có yêu cầu bảo hành khách inbox messenger trực tiếp shop nhé, shop sẽ đến nhận sản phẩm và bảo hành cho khách.
      </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(UserWarranty);