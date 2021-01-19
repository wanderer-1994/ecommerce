import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeVnCharacter,
  convertTimeStamp,
  convertWarrantyPeriod,
  convertWarrantyExpire,
  sortOrderByTimestampId,
  resolveProduct,
  calculateSalePrice
} from "../../../utils/functions";
import {
  adminLoadOrders,
  updateOrders
} from "../../../api/apiAdmin";
import { open_appAlert, appLoading } from "../../../utils/appFunction";
import "./Order.css";
import ArrowForward from "@material-ui/icons/ArrowForward";

class Order extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      ori_orders: [],
      orders:[],
      since: new Date((parseInt(Date.now()/(24*60*60*1000)) - 3) * 24*60*60*1000 + 7*60*60*1000).getTime(),
      upto: new Date((parseInt(Date.now()/(24*60*60*1000))) * 24*60*60*1000 + 7*60*60*1000).getTime(),
      searchText: "",   // user_name, user_tel, user_address, prod_name, sup_name, s_key
      searchStatus: ""  // "đã tiếp nhận", "đơn ảo", "đã giao hàng", "đang bảo hành"
    }
  }

  componentDidMount = () => {
    appLoading(false);
  }

  handleChangeDateInput = (since_or_upto, day_or_hour, value) => {
    let state = { ...this.state };
    if(day_or_hour == "day"){
      let year = value.split("-")[0];
      let month = parseInt(value.split("-")[1]) - 1; // hàm new Date(yyyy, mm, dd) có tháng lấy số thứ tự từ 0
      let day = value.split("-")[2];
      let hour_part_timestamp = Math.abs(state[since_or_upto] - new Date(`${year}, ${month}, ${day}`)) % (24*60*60*1000);
      state[since_or_upto] = new Date(year, month, day).getTime() + hour_part_timestamp;
    }else if(day_or_hour == "hour"){
      let year = new Date(state[since_or_upto]).getFullYear();
      let month = new Date(state[since_or_upto]).getMonth();
      month = (parseInt(month)).toString(); // hàm new Date(yyyy, mm, dd) lấy số tt month từ 0
      let day = new Date(state[since_or_upto]).getDate();
      let day_part_timestamp = new Date(year, month, day).getTime();
      let hour_part_timestamp = parseInt(value)*60*60*1000;
      state[since_or_upto] = day_part_timestamp + hour_part_timestamp;
    }
    if(since_or_upto == "since"){
      if(state.upto < state.since){
        state.upto = state.since
      }
    }else if(since_or_upto == "upto"){
      if(state.since > state.upto){
        state.since = state.upto
      }
    }
    this.setState(state);
  }

  handleChangeSearch = (event) => {
    let state = {...this.state}
    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  handleChangeSearchStatus = (status_value) => {
    let sorted_orders = [];
    let { ori_orders } = this.state
    if(status_value && status_value != ""){
      ori_orders.forEach(order_item => {
        if(order_item.status == status_value){
          sorted_orders.push({...order_item});
        }
      })
    }else{
      sorted_orders = JSON.parse(JSON.stringify(ori_orders));
    }
    this.setState({
      searchStatus: status_value || "",
      orders: sorted_orders
    })
  }

  handleChangeOrderInfo = (record_id, attr, value) => {
    let orders = JSON.parse(JSON.stringify(this.state.orders));
    let match_item = orders.find(item => {return item.record_id == record_id});
    if(match_item) match_item[attr] = value;
    this.setState({orders: orders});
  }

  handleSaveOrderInfo = async (orders) => {
    let data = await updateOrders(orders);
    if(data.isSuccess){
      // update ori_orders state
      let ori_orders = JSON.parse(JSON.stringify(this.state.orders));
      orders.forEach(new_ord_item => {
        let match_ori_item = ori_orders.find(item => {return item.record_id == new_ord_item.record_id});
        if(match_ori_item) ori_orders.splice(ori_orders.indexOf(match_ori_item), 1, {...new_ord_item});
      })
      this.setState({
        ori_orders: ori_orders
      })
    }
  }

  loadData = async () => {
    appLoading(true);
    let options = {
      since: this.state.since,
      upto: this.state.upto,
      searchText: this.state.searchText,
      searchStatus: this.state.searchStatus
    };
    let data = await adminLoadOrders(options);
    let orders = data.orders || [];
    if(orders.length < 1){
      open_appAlert({
        showConfirm: true,
        title: <div style={{textAlign: "center", color: "red", fontStyle: "italic", margin: "20px"}}>không tìm thấy đơn hàng nào!</div>,
        cancelTitle: "cancel",
        submitTitle: "ok",
      })
    }else{
      orders.forEach((order_item, index) => {
        orders[index] = resolveProduct(orders[index]);
      })
      this.setState({
        orders: orders,
        ori_orders: orders,
        searchText: "",
        searchStatus: ""
      })
    }
    appLoading(false);
  }

  clearSort = () => {
    this.setState({
      searchText: "",
      searchStatus: ""
    })
  }

  render() {
    let { ori_orders, orders, since, upto, searchText, searchStatus } = this.state;
    let hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    let order_status = ["đã tiếp nhận", "đơn ảo", "đã giao", "đang bảo hành"];
    let total_product_item = 0;
    orders.forEach(item => {
      total_product_item += item.order_qty;
    })
    let order_bills = sortOrderByTimestampId(orders);
    return (
      <React.Fragment>
        <div className="Order">
          <div className="header">order by bill (order by customer)</div>
          <div className="sorter">
            <span className="since">
              since<br></br>
              <select
                value={(since != null && since != "") ? convertTimeStamp(since, "HH") : ""}
                onChange={(event) => this.handleChangeDateInput("since", "hour", event.target.value)}
              >
                {hours.map((hr_item, index) => {
                  if(hr_item < 10){
                    hr_item = `0${hr_item}`;
                  }else{
                    hr_item = hr_item.toString();
                  }
                  return (
                    <option key={index} value={hr_item}>{hr_item}</option>
                  )
                })}
              </select>
              hr
              <input
                value={(since != null && since != "") ? convertTimeStamp(since, "yyyy-mm-dd") : ""}
                type="date"
                onChange={(event) => this.handleChangeDateInput("since", "day", event.target.value)}
              />
            </span>
            <ArrowForward/>
            <span className="upto">
              upto<br></br>
              <select
                value={(upto != null && upto != "") ? convertTimeStamp(upto, "HH") : ""}
                onChange={(event) => this.handleChangeDateInput("upto", "hour", event.target.value)}
              >
                {hours.map((hr_item, index) => {
                  if(hr_item < 10){
                    hr_item = `0${hr_item}`;
                  }else{
                    hr_item = hr_item.toString();
                  }
                  return (
                    <option key={index} value={hr_item}>{hr_item}</option>
                  )
                })}
              </select>
              hr
              <input
                value={(upto != null && upto != "") ? convertTimeStamp(upto, "yyyy-mm-dd") : ""}
                type="date"
                onChange={(event) => this.handleChangeDateInput("upto", "day", event.target.value)}
              />
            </span>
            <span className="searchStatus">
              searchStatus<br></br>
              <select
                value={searchStatus}
                name="searchStatus"
                onChange={(event) => this.handleChangeSearchStatus(event.target.value)}
              >
                <option value="">---</option>
                {order_status.map((status_item, index) => {
                  return (
                    <option key={index} value={status_item}>{status_item}</option>
                  )
                })}
              </select>
            </span>
            <span className="searchStatus">
              searchText<br></br>
              <input
                value={searchText}
                name="searchText"
                placeholder="phone, user, product, address..."
                onChange={(event) => this.handleChangeSearch(event)}
              />
            </span>
            <button className="actionLoad" onClick={() => this.loadData()}>load</button>
            <button className="actionClear" onClick={() => this.clearSort()}>xóa lọc</button>
          </div>
          <div className="summary">{`tổng bill: ${order_bills.length} --- tổng đơn: ${total_product_item}`}</div>
          <div className="orderWrapper">
              {order_bills.map((bill_order, index) => {
                  let grand_total_check = 0;
                  return (
                      <div key={index} className="billWrapper">
                          <div className="billTitle">
                              <span>SĐT: {bill_order.products[0].user_tel}</span>
                              <span>Khách: {bill_order.products[0].user_name}</span>
                              <span>Địa chỉ: {bill_order.products[0].user_address}</span>
                              <span>Ngày đặt: {convertTimeStamp(parseInt(bill_order.timestamp_id), "HHhMM-dd-mm-yyyy")}</span>
                          </div>
                          {bill_order.products.map((order, prod_index) => {
                              let match_ori_orders = ori_orders.find(item => {return item.record_id == order.record_id}) || {};
                              
                              let prod_thumb = (order.prod_thumb && order.prod_thumb != "") ? order.prod_thumb : order.prod_img;
                              if(!prod_thumb) prod_thumb = "";
                              prod_thumb = prod_thumb.split("imgSpliter_TKH")[0];
                              let prod_name = (order.prod_name && order.prod_name != "") ? order.prod_name : (order.sup_name ? order.sup_name : "");
                              let prod_link = prod_name.replace(/[\s+,+\.+(+)+\\+\/+]/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "").toLowerCase();
                              prod_link = removeVnCharacter(prod_link);
                              prod_link = `/${prod_link}_pro${order.prod_id}`;

                              let saleoff_percent = parseFloat(order.saleoff_percent) > 0 ? parseFloat(order.saleoff_percent) : 0;
                              let sale_price = calculateSalePrice(order.prod_price, saleoff_percent);
                              let total_check = sale_price * order.order_qty;
                              grand_total_check += total_check;
                              return (
                                <div key={prod_index} className="productWrapper">
                                  <div className="prodImg">
                                    <a href={prod_link} target="blank"><img src={prod_thumb}></img></a>
                                  </div>
                                  <div className="prodName">
                                    <a href={prod_link} target="blank">{prod_name}</a>
                                    <input
                                      disabled={true}
                                      placeholder="..."
                                      value={order.note ? order.note : "no user note..."}
                                    />
                                  </div>
                                  <div className="priceGroup">
                                    <span>Đơn giá:</span>
                                    {saleoff_percent > 0 ? <span className="rootPrice">{order.prod_price.toLocaleString()}đ</span> : null}
                                    <span className="prodPrice">{sale_price.toLocaleString()}đ</span>
                                    {saleoff_percent > 0 ? <span className="saleInfo">{`-${saleoff_percent.toLocaleString()}%`}</span> : null}
                                  </div>
                                  <div className="orderQty">
                                      <span>Số lượng:</span>
                                    <input type="number"
                                      disabled={true}
                                      value={order.order_qty }
                                    />
                                  </div>
                                  <div className="warranty">
                                      Bảo hành: {<span>{convertWarrantyPeriod(order.warranty)}</span>}<br></br>
                                      Đến ngày: {<span>{convertWarrantyExpire(order.timestamp_id, order.warranty)}</span>}
                                  </div>
                                  <div className="status">
                                    status
                                    <select
                                      value={order.status != null ? order.status : ""}
                                      onChange={(event) => this.handleChangeOrderInfo(order.record_id, "status", event.target.value)}
                                      style={{color: (order.status != match_ori_orders.status ? "red" : null), backgroundColor: (match_ori_orders.status == "đang bảo hành" ? "yellow" : null)}}
                                    >
                                      <option value="">---</option>
                                      {order_status.map((status_item, index) => {
                                        return <option key={index} value={status_item}>{status_item}</option>
                                      })}
                                    </select>
                                  </div>
                                  <button className="save"
                                    onClick={order.status != match_ori_orders.status ? () => this.handleSaveOrderInfo([order]) : null}
                                    style={order.status != match_ori_orders.status ? null : {opacity: "0.5"}}
                                  >lưu</button>
                                </div>
                              )
                          })}
                          <div className="grandTotal">Tổng cộng: {grand_total_check.toLocaleString()}</div>
                      </div>
                  )
              })}
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

export default connect(mapStateToProps)(Order);