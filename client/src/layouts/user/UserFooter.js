import React from "react";
import { connect } from "react-redux";
import "./UserFooter.css";

class UserFooter extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div className="UserFooter">
          <div className="fanpageWrapper">
            <div
              className="fb-page"
              data-href="https://www.facebook.com/phukiendhqg/"
              data-tabs="timeline" data-width="" data-height="70"
              data-small-header="false" data-adapt-container-width="true"
              data-hide-cover="false" data-show-facepile="true"
            >
              <blockquote
                cite="https://www.facebook.com/phukiendhqg/"
                className="fb-xfbml-parse-ignore"
              >
                <a href="https://www.facebook.com/phukiendhqg/">Shop phụ kiện Làng đại học Thủ đức</a>
              </blockquote>
            </div>
          </div>
          <div className="shopInfo">
            <p>shop đồ chơi, phụ kiện điện thoại, phụ kiện lap top Làng đại học linh trung thủ đức</p>
            <p><a 
                href="https://www.google.com/maps/place/Linh+Trung,+Ph%C6%B0%E1%BB%9Dng+Linh+Trung,+Th%E1%BB%A7+%C4%90%E1%BB%A9c,+H%E1%BB%93+Ch%C3%AD+Minh/@10.8686044,106.7986799,18z/data=!4m5!3m4!1s0x31752758d24c6677:0xe5aa8e613f77a7a9!8m2!3d10.8687722!4d106.8004692"
                target="blank"
              >địa chỉ: 20/97 xa lộ hà nội, phường linh trung, quận thủ đức
              </a></p>
            <h2>24/7 ONLINE STORE</h2>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {

    }
};

export default connect(mapStateToProps)(UserFooter);