import React from "react";
import { connect } from "react-redux";
import phukiendhqg_logo from "../../assets/hoco-e17.jpg";
import "./UserNavbar.css";
import { Link, withRouter } from "react-router-dom";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import store from "../../redux/store";
import Menu from "@material-ui/icons/Menu";
import { toggleSidebar } from "../../utils/functions";
import queryString from "query-string";
import $ from "jquery";

class UserNavbar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      admin: this.props.admin,
      ori_admin_id: this.props.admin ? this.props.admin.admin_id : "",
      ori_cart: JSON.stringify(this.props.cart),
      searchText: "",
      cartCount: 0
    }
  }

  handleSearch = event => {
    event.preventDefault();
    this.props.history.push(`/tim-kiem?search=${this.state.searchText}`);
    $(".UserNavbarSearch input").blur();
  }

  changeSearchText = event => {
    this.setState({searchText: event.target.value});
  }

  updateCartCount = () => {
    let cart = this.props.cart;
    if(!cart) cart = [];
    let cartCount = 0;
    cart.forEach(item => {
      cartCount += parseInt(item.order_qty);
    })
    this.setState({
      cartCount: cartCount,
      ori_cart: JSON.stringify(this.props.cart)
    });
  }

  componentDidMount = () => {
    this.updateCartCount();
    if(this.props.location.pathname == "/tim-kiem") this.configSearchInput(this.props.location.search);
    this.unsubscribe = store.subscribe(() => {
      if(this.state.ori_cart != JSON.stringify(this.props.cart)) {
        this.updateCartCount();
      }
      let store_admin_id = this.props.admin ? this.props.admin.admin_id : "";
      if(this.state.ori_admin_id != store_admin_id) this.setState({admin: this.props.admin});
    })
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if(nextProps.location.pathname == "/tim-kiem"){
      this.configSearchInput(nextProps.location.search);
    }else{
      this.setState({searchText: ""});
    }
  }

  configSearchInput = (search) => {
    let searchText = "";
    let  query = queryString.parse(search);
    if(query && query.search){
      searchText = query.search;
    }
    this.setState({searchText: searchText});
  }

  render() {
    let { cartCount } = this.state;
    let { admin } = this.state;
    return (
      <React.Fragment>
        <div className="UserNavbarBackground">

        </div>
        <div className="UserNavbarLink">
          {admin && admin.admin_id ? (
            <span><Link to="/admin">Quản trị</Link></span>
          ) : null}
          <span><Link to="/">Trang chủ</Link></span>
          <span><Link to="/tra-cuu-don-hang">Tra cứu bảo hành</Link></span>
          <span><Link to="/huong-dan-mua-hang">Hướng dẫn mua hàng</Link></span>
          <span><Link to="/chinh-sach-bao-hanh">Chính sách bảo hành</Link></span>
        </div>
        <div className="UserNavbarSearch">
          <Menu
            className="mobileMenu"
            onClick={() => toggleSidebar()}
          />
          <form onSubmit={(event) => this.handleSearch(event)}>
            <input type="text" name="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={this.state.searchText}
              onChange={event => this.changeSearchText(event)}
            />
            <button type="submit">Search</button>
          </form>
          <Link to="/gio-hang">
            <div className="UserCart">
              <ShoppingCart />
              {cartCount > 0 ? <span className="CartCount">{cartCount}</span> : null}
            </div>
          </Link>
        </div>
        <div className="UserNavbarLogo">
          <Link to="/"><img src={phukiendhqg_logo} alt="phukienDHQG" /></Link>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
        cart: state.cart,
        admin: state.admin
    }
};

export default connect(mapStateToProps)(withRouter(UserNavbar));