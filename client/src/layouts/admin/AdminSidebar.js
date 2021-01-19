import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./AdminSidebar.css";
import { adminLogout } from "../../api/apiAdmin";
import Close from "@material-ui/icons/Close";
import { toggleAdminSidebar } from "../../utils/functions";

class AdminSidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      links: [
        {url: "/admin/product", name: "Sản phẩm"},
        {url: "/admin/order", name: "Đơn hàng"},
        {url: "/admin/order-import", name: "Nhập hàng"},
        {url: "/admin/warranty", name: "Yêu cầu bảo hành"},
        {url: "/admin/category", name: "Danh mục"},
        {url: "/admin/user-management", name: "Danh sách khách hàng"},
        {url: "/admin/admin-management", name: "Danh sách admin"},
        {url: "/", name: "Trang mua hàng"}
      ],
      pathname: this.props.location.pathname,
    }
  }

  handleLogout = async () => {
    let admin_cookie = this.props.admin.admin_cookie;
    let data = await adminLogout(admin_cookie);
    if(data.isSuccess){
      this.props.dispatch({type: "UPDATE_ADMIN", payload: {}});
      localStorage.setItem("admin_cookie", "");
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if(this.props.location.pathname != nextProps.location.pathname){
      this.setState({pathname: nextProps.location.pathname});
    };
  }

  handleToggleSidebar = () => {
    let isMobile = window.innerWidth < 800 ? true : false;
    if(isMobile) setTimeout(() => {
      toggleAdminSidebar()
    }, 200);
  }

  render() {
    return (
      <div className="AdminSidebar Sidebar">
        <div className="mobileSidebarClose">
          <Close onClick={() => {toggleAdminSidebar()}}/>
        </div>
        <ul>
          {this.state.links.map((item, index) => {
            return (<li key={index}><Link to={item.url} 
                        onClick={() => this.handleToggleSidebar()}
                        className={this.state.pathname == item.url ? "active" : null}
                    >{item.name}</Link></li>)
          })}
          <li key="dang_xuat"><Link to="/" onClick={() => this.handleLogout()}>Đăng xuất</Link></li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state){
    return {
      admin: state.admin
    }
};

export default connect(mapStateToProps)(AdminSidebar);