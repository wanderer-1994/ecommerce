import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProducts, submitOrder } from "../../../api/apiCall";
import store from "../../../redux/store";
import { removeVnCharacter, resolveProduct, calculateSalePrice } from "../../../utils/functions";
import { orderQtyChange, emptyCart, open_appAlert, appLoading } from "../../../utils/appFunction";
import "./UserCart.css";
import $ from "jquery";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";

class UserCart extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      ori_cart: "[]",
      cart: [],
      user: {
        user_tel: "",
        user_name: "",
        user_address: ""
      }
    }
  }

  componentDidMount = ()=> {
    appLoading(false);
    let cart = JSON.parse(JSON.stringify(this.props.cart || []));
    this.loadData(cart, [...this.state.cart]);
    this.unsubscribe = store.subscribe( async () => {
      let new_cart = JSON.parse(JSON.stringify(store.getState().cart || []));
      if(JSON.stringify(new_cart) != this.state.ori_cart && this.props.appLoading == false){
        this.loadData(new_cart, [...this.state.cart]);
      }
    })
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  }

  setStateAsync = (options) => {
    return new Promise((resolve, reject) => {
      this.setState(options, () => {
        resolve();
      })
    })
  }

  loadData = async (cart, current_state_cart) => {
    // compare current_state_cart to prevent double loading product data
    // await this.setStateAsync({ori_cart: JSON.stringify(cart)});
    let ori_cart = JSON.parse(JSON.stringify(cart));
    let isOutStock = false;
    for(let i = 0; i < cart.length; i++){
      let product;
      let matchItem = current_state_cart.find(item => {return item.prod_id == cart[i].prod_id});
      if(matchItem && matchItem.prod_name){
        product = matchItem;
      }else{
        let data = await getProducts(`/api/product-user?prod_id=${cart[i].prod_id}`);
        product = resolveProduct(data.products[0]);
      }
      if(!product || !product.prod_id){
        cart.splice(i, 1);
        ori_cart.splice(i, 1);
        i -= 1;
        isOutStock = true;
      }else{
        cart[i] = {...product, ...cart[i]};
      }
    }
    if(isOutStock){
      localStorage.setItem("cart", JSON.stringify(ori_cart));
      this.props.dispatch({type: "UPDATE_CART", payload: ori_cart})
    }else{
      await this.setStateAsync({
        ori_cart: JSON.stringify(ori_cart),
        cart: cart
      });
    };
    appLoading(false);
  }

  handleOrderQtyChange = (target, prod_thumb, prod_id, new_order_qty, new_order_note) => {
    if(new_order_qty > 0){
      orderQtyChange(target, prod_thumb, prod_id, new_order_qty, new_order_note);
    }else if(new_order_qty <= 0 || new_order_qty == ""){
      open_appAlert({
        title: <div style={{color: "red", textAlign: "center", height: "40px"}}>Bạn có muốn bỏ sản phẩm?</div>,
        showConfirm: true,
        onClickCancel: () => {},
        onClickSubmit: () => {orderQtyChange(target, prod_thumb, prod_id, new_order_qty = 0, new_order_note);},
        cancelTitle: "Hoy đừng",
        submitTitle: "ohm, yes"
      })
    }
  }

  handleChangeUserInfo = event => {
    let changed_attr = event.target.name;
    let new_value = event.target.value;
    let user = this.state.user;
    user[changed_attr] = new_value;
    this.setState({user: user});
  }

  openUserInfo = () => {
    if(this.props.cart.length > 0){
      $("body").css("overflow", "hidden");
      $(".mainCart .userInfo").fadeIn(100);
      $(".mainCart .proceedOrder").fadeOut(100);
    }else{
      open_appAlert({
        showConfirm: true,
        icon: "",
        title: <div style={{color: "violet", textAlign:"center", height: "50px"}}>Bạn chưa có sản phẩm nào trong giỏ!</div>,
        cancelTitle: <Link style={{textDecoration: "none", display: "block", width: "100%", height: "100%", lineHeight: "50px"}} to="/"><span style={{color: "white"}}>Mua sắm thôi!</span></Link>,
        submitTitle: <Link style={{textDecoration: "none", display: "block", width: "100%", height: "100%", lineHeight: "50px"}} to="/"><span style={{color: "white"}}>Let's go</span></Link>
      })
    }
  }

  closeUserInfo = () => {
    $("body").css("overflow", "auto");
    $(".mainCart .userInfo").fadeOut(100);
    $(".mainCart .proceedOrder").fadeIn(100);
  }

  handleSubmitOrder = async () => {
    try{
      this.closeUserInfo();
      let cart = JSON.parse(JSON.stringify(this.props.cart));
      let user = this.state.user;
      let isUserValid = this.checkUserValid(user);
      let isCartValid = this.checkCartValid(cart);
      if(isUserValid && isCartValid){
        let data = await submitOrder(user, cart);
        if(data.isSuccess){
          let date_timestamp = Date.now()%(24*60*60*1000);
          let gmt_hour = 7;
          let cur_hour = parseInt(date_timestamp/(60*60*1000)) + gmt_hour + 1;
          let shipping_message = (cur_hour <= 14) ?
                                <li style={{marginBottom: "10px"}}>Tuyệt vời! Đơn của bạn được đặt trước 14h, sẽ được giao tới bạn trong tối  nay!</li> : 
                                <li style={{marginBottom: "10px"}}>Tuyệt vời! Đơn của bạn được đặt sau 14h, sẽ được giao tới bạn trong tối mai!</li>
          open_appAlert({
            showConfirm: true,
            icon: "",
            title: <div style={{color: "violet", textAlign:"center", height: "50px"}}>ĐẶT HÀNG THÀNH CÔNG!</div>,
            message: (
              <div style={{marginLeft: "50px", marginBottom: "20px"}}>
                <ul style={{color: "green"}}>
                  {shipping_message}
                  <li>Shop sẽ liên hệ lại với bạn để xác nhận và giao hàng!</li>
                </ul>
              </div>
            ),
            cancelTitle: "Yes",
            submitTitle: "Quá tuyệt vời"
          });
          emptyCart();
        }else{
          let message;
          if(data.deleted_products && data.deleted_products.length > 0){
            message = <li>Một số sản phẩm vừa mới hết hàng. Bạn kiểm tra lại giỏ hàng nhé!</li>
            cart.forEach((item, index) => {
              let match_deleted = data.deleted_products.find(prod => {return unescape(prod.prod_id) == item.prod_id});
              if(match_deleted) cart.splice(index, 1);
            })
            localStorage.setItem("cart", JSON.stringify(cart));
            this.props.dispatch({type: "UPDATE_CART", payload: cart});
          }else{
            message = <li>Dường như có lỗi hệ thống. Bạn thử lại nhé! Hic :((</li>
          }
          open_appAlert({
            icon: "",
            title: <div style={{color: "red", textAlign:"center", height: "50px"}}>FAILED!</div>,
            message: (
              <div style={{marginLeft: "50px", marginBottom: "20px"}}>
                <ul style={{color: "green"}}>
                  {message}
                </ul>
              </div>
            ),
            showConfirm: true,
            cancelTitle: "Hic :((",
            submitTitle: "Bùn ghê"
          })
        }
      }else{
        open_appAlert({
          icon: "",
          title: <div style={{color: "red", textAlign:"center", height: "50px"}}>FAILED!</div>,
          message: (
            <div style={{marginLeft: "50px", marginBottom: "20px"}}>
              <ul style={{color: "green"}}>
                {!isUserValid ? <li>Thông tin giao hàng không hợp lệ!</li> : null}
                {!isCartValid ? <li>Giỏ hàng không hợp lệ!</li> : null}
              </ul>
            </div>
          ),
          showConfirm: true,
          cancelTitle: "Really? Let me check!",
          submitTitle: "Oh, got it!",
          onClickSubmit: this.openUserInfo,
          onClickCancel: this.openUserInfo 
        })
      }
    }catch(err){
      console.log(err);
    }
  }

  checkUserValid = user => {
    let required = ["user_tel", "user_name", "user_address"];
    for(let i = 0; i < required.length; i++){
      if(!user || !user[required[i]] || user[required[i]] == ""){
        return false;
      } 
    }
    return true;
  }

  checkCartValid = cart => {
    let required = ["prod_id", "order_qty", "note"];
    if(!cart || !cart.length || cart.length < 1) return false;
    for(let i = 0; i < cart.length; i++){
      if(!cart[i].prod_id || cart[i].prod_id == "") return false;
      if(!cart[i].order_qty || cart[i].order_qty < 1) return false;
    }
    return true;
  }

  render() {
    let { cart, user } = this.state;
    let grand_total_check = 0;

    return (
      <React.Fragment>
        <div className="mainCart">
          <div className="maincartWrapper">
            <div className="backBar">
              <div
                className="backButton"
                onClick={() => this.props.history.goBack()}
              ><ArrowBackIos/><ArrowBackIos/></div>
            </div>
            <h1 className="title">Wish you a hapy shopping!</h1>
            <div className="orderGeneralWrapper">
              {cart.map((order, index) => {
                let prod_thumb = (order.prod_thumb && order.prod_thumb != "") ? order.prod_thumb : order.prod_img;
                if(!prod_thumb) prod_thumb = "";
                prod_thumb = prod_thumb.split("imgSpliter_TKH")[0];
                let prod_name = (order.prod_name && order.prod_name != "") ? order.prod_name : (order.sup_name || "");
                let prod_link = prod_name.replace(/[\s+,+\.+(+)+\\+\/+]/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "").toLowerCase();
                prod_link = removeVnCharacter(prod_link);
                prod_link = `/${prod_link}_pro${order.prod_id}`;

                let saleoff_percent = parseFloat(order.saleoff_percent) > 0 ? parseFloat(order.saleoff_percent) : 0;
                let sale_price = calculateSalePrice(order.prod_price, saleoff_percent);
                let total_check = sale_price * order.order_qty;
                grand_total_check += total_check;
                return (
                  <div key={index} className="orderWrapper">
                    <div className="prodImg">
                      <Link to={prod_link}><img src={prod_thumb}></img></Link>
                    </div>
                    <div className="prodName">
                      <Link to={prod_link}>{prod_name}</Link>
                      <input
                        placeholder="Thêm ghi chú..."
                        value={order.note || ""}
                        onChange={(event) => this.handleOrderQtyChange(event.target, prod_thumb, order.prod_id, order.order_qty, event.target.value)}
                      />
                    </div>
                    <div className="priceGroup">
                      <span>Đơn giá:</span><br/> 
                      {saleoff_percent > 0 ? <span className="rootPrice">{order.prod_price.toLocaleString()}đ</span> : null}
                      <span className="prodPrice">{sale_price.toLocaleString()}đ</span>
                      {saleoff_percent > 0 ? <span className="saleInfo">{`-${saleoff_percent.toLocaleString()}%`}</span> : null}
                    </div>
                    <div className="orderQty">
                      <span className="minus"
                        onClick={(event) => this.handleOrderQtyChange(event.target, prod_thumb, order.prod_id, order.order_qty - 1, order.note)}
                      ><Remove/></span>
                      <input type="number"
                        onChange={(event) => this.handleOrderQtyChange(event.target, prod_thumb, order.prod_id, event.target.value, order.note)}
                        value={order.order_qty || ""}
                      />
                      <span className="plus"
                        onClick={(event) => this.handleOrderQtyChange(event.target, prod_thumb, order.prod_id, order.order_qty + 1, order.note)}
                      ><Add/></span>
                    </div>
                    <div className="totalCheck"><span>Tổng cộng:</span><br />{total_check.toLocaleString()}</div>
                    <div className="delete" onClick={(event) => this.handleOrderQtyChange(event.target, prod_thumb, order.prod_id, 0, order.note)}>Xóa</div>
                  </div>
                )
              })}
            </div>
            <button
              className="proceedOrder"
              onClick={() => this.openUserInfo()}
            >
              Tiến hành mua hàng
            </button>
          </div>
          <div className="userInfo">
            <div className="userInfoWrapper0">
              <h1 className="userInfoTitle">Thông tin nhận hàng của bạn...</h1>
              <div className="userInfoWrapper1">
                <div>
                  <input
                    name="user_tel"
                    placeholder="Số điện thoại của bạn..."
                    value={user.user_tel || ""}
                    onChange={(event) => {this.handleChangeUserInfo(event)}}
                  />
                </div>
                <div>
                  <input
                    name="user_name"
                    placeholder="Tên của bạn..."
                    value={user.user_name || ""}
                    onChange={(event) => {this.handleChangeUserInfo(event)}}
                  />
                </div>
                <div>
                  <textarea
                    name="user_address"
                    placeholder="Địa chỉ của bạn..."
                    value={user.user_address || ""}
                    onChange={(event) => {this.handleChangeUserInfo(event)}}
                  />
                </div>
              </div>
              <div className="note">
                <div>**Note:</div>
                <ul>
                  <li>freeship khu vực Làng ĐH. Các khu vực khác vui lòng inbox shop.</li>
                  <li>đơn hàng đặt trước 2h chiều sẽ được giao trong ngày.</li>
                  <li>đơn hàng đặt sau 2h chiều sẽ được giao vào ngày hôm sau.</li>
                  <li>đơn hàng sẽ được chuyển tới các bạn vào lúc 6h - 9h tối.</li>
                  <li>nhập địa chỉ cụ thể để hỗ trợ shop trong việc giao hàng nhé!</li>
                </ul>
              </div>
              <div className="userInfoFooter">
                <button className="cancel"
                  onClick={() => this.closeUserInfo()}
                >Thoát</button>
                <button className="submit"
                  onClick={() => this.handleSubmitOrder()}
                >Đặt hàng</button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
      cart: state.cart,
      appLoading: state.appLoading
    }
};

export default connect(mapStateToProps)(UserCart);