import React from "react";
import { connect, Provider } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeVnCharacter,
  convertTimeStamp,
  convertWarrantyPeriod,
  convertWarrantyExpire,
  sortOrderByProduct_n_Status,
  resolveProduct,
  calculateSalePrice
} from "../../../utils/functions";
import {
  adminLoadOrders
} from "../../../api/apiAdmin";
import { open_appAlert, appLoading } from "../../../utils/appFunction";
import "./OrderImport.css";
import ArrowForward from "@material-ui/icons/ArrowForward";

class OrderImport extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      orders: [],
      sorted_orders: [],
      since: new Date((parseInt(Date.now()/(24*60*60*1000)) - 3) * 24*60*60*1000 + 7*60*60*1000).getTime(),
      upto: new Date((parseInt(Date.now()/(24*60*60*1000))) * 24*60*60*1000 + 7*60*60*1000).getTime(),
      searchText: "",   // user_name, user_tel, user_address, prod_name, sup_name, s_key
      searchStatus: "", // "đã tiếp nhận", "đơn ảo", "đã giao hàng", "đang bảo hành"
      sup_sorter: "",
      adminOnly: "allInfo"
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
      let hour_part_timestamp = Math.abs(state[since_or_upto] - (new Date(year, month, day).getTime()% (24*60*60*1000))) % (24*60*60*1000);
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
        sorted_orders: orders,
        sup_sorter: "",
        searchStatus: "",
        searchText: ""
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

  handleChangeSupSorter = (supplier_name) => {
    let { orders, searchStatus } = this.state;
    let sorted_orders = this.filter_product_after_load(orders, supplier_name, searchStatus);
    this.setState({
      sup_sorter: supplier_name,
      sorted_orders: sorted_orders
    })
  }

  handleChangeSearchStatus = status_value => {
    let { orders, sup_sorter } = this.state;
    let sorted_orders = this.filter_product_after_load(orders, sup_sorter, status_value);
    this.setState({
      searchStatus: status_value,
      sorted_orders: sorted_orders
    })
  }

  filter_product_after_load = (orders, supplier_name, searchStatus) => {
    let final_result = [];
    let result = [];
    if(supplier_name && supplier_name != ""){
      orders.forEach(ord_item => {
        if(ord_item.prod_link.indexOf(supplier_name) > -1){
          result.push({...ord_item});
        }
      })
    }else{
      result = orders || [];
    }
    // console.log(result)
    if(searchStatus && searchStatus != ""){
      result.forEach(ord_item => {
        if(ord_item.status == searchStatus){
          final_result.push({...ord_item});
        }
      })
    }else{
      final_result = result;
    }
    return final_result;
  }

  handleToggleAdminOnly = () => {
    let { adminOnly } = this.state;
    if(adminOnly == "adminOnly"){
      adminOnly = "allInfo";
    }else{
      adminOnly = "adminOnly"
    }
    this.setState({adminOnly: adminOnly})
  }

  render() {
    let { orders, sorted_orders, sup_sorter, since, upto, searchText, searchStatus, adminOnly } = this.state;
    let hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    let order_status = ["đã tiếp nhận", "đơn ảo", "đã giao", "đang bảo hành"];
    let total_product_item = 0;
    sorted_orders.forEach(item => {
      total_product_item += item.order_qty;
    })
    let order_products = sortOrderByProduct_n_Status(sorted_orders);
    let grand_total_all = 0;
    return (
      <React.Fragment>
        <div className="OrderImport">
          <div className="header">order import (order by product)</div>
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
            {(orders && orders.length > 0) ? (
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
            ) : null}
            {/* <span className="searchStatus">
              searchText<br></br>
              <input
                value={searchText}
                name="searchText"
                placeholder="phone, user, product, address..."
                onChange={(event) => this.handleChangeSearch(event)}
              />
            </span> */}
            {(orders && orders.length > 0) ? (
              <span className="sup_sorter">
                sup_sorter<br></br>
                <select
                  value={sup_sorter}
                  name="sup_sorter"
                  onChange={(event) => this.handleChangeSupSorter(event.target.value)}
                >
                  <option value="">---</option>
                  <option value="phatdatcomputer.vn">pdcom</option>
                  <option value="phatdatbinhthoi.com.vn">pdbt</option>
                </select>
              </span>
            ) : null}
            <button className="actionLoad" onClick={() => this.loadData()}>load</button>
            <button className="actionClear" onClick={() => this.clearSort()}>xóa lọc</button>
            <button className="hideAdminOnly" onClick={() => this.handleToggleAdminOnly()}>{adminOnly}</button>
          </div>
          <div className="summary">{`tổng sản phẩm: ${order_products.length} --- tổng đơn: ${total_product_item}`}</div>
          <div className="orderWrapper">
              {order_products.map((prod_item, index) => {
                  let grand_total_product = 0;
                  let total_order_qty = 0;
                  prod_item.order_qty.forEach(qty_item => {
                    total_order_qty += qty_item;
                    if(typeof(prod_item.sup_price) == "number"){
                      grand_total_product += qty_item*prod_item.sup_price;
                    }
                  });
                  grand_total_all += grand_total_product;
                  return (
                    <div key={index} className="prodWrapper">
                      <div className="thumbContainer">
                        <img src={prod_item.prod_thumb}></img>
                      </div>
                      <div className="prod_name">
                        <a href={prod_item.prod_link} target="blank">{(prod_item.sup_name && prod_item.sup_name != "") ? prod_item.sup_name : prod_item.prod_name}</a>
                      </div>
                      <div className="order_qty">
                        {prod_item.order_qty.map((qty_item, index) => {
                          return (
                            <p key={index}>
                              <span>sl: {qty_item}</span>
                              <span className="note">{prod_item.note[index] != null && prod_item.note[index] != "" ? prod_item.note[index] : "no user note..."}</span>
                              <span>giao: {prod_item.ship_qty[index] || 0}</span>
                              <span>{prod_item.status[index] || "đã tiếp nhận"}</span>
                            </p>
                          )
                        })}
                      </div>
                      <div className="total_order_qty">
                        tổng sl:
                        <p>{total_order_qty.toLocaleString()}</p>
                      </div>
                      <div className="sup_price">
                        đơn giá:
                        <p><span className={adminOnly}>sup_price:</span> {prod_item.sup_price != null ? prod_item.sup_price.toLocaleString() : 0}</p>
                        <p className={`sellPrice ${adminOnly}`}>sell_price: {calculateSalePrice(prod_item.prod_price, prod_item.saleoff_percent).toLocaleString()}</p>
                      </div>
                      <div className="grand_total_product">
                        thanh toán:
                        <p>{grand_total_product.toLocaleString()}</p>
                      </div>
                    </div>
                  )
              })}
          </div>
          <div className="grand_total_all">{`tổng: ${grand_total_all.toLocaleString()} đ`}</div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(OrderImport);