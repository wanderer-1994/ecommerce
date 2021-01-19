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
    calculateSalePrice,
    checkWarranty
} from "../../../utils/functions";
import { open_appAlert, appLoading } from "../../../utils/appFunction";
import "./CheckOrder.css";
import { getOrders, user_triggerWarranty } from "../../../api/apiCall"

class CheckOrder extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchText: "",
            orders: null,
        }
    }

    componentDidMount = () => {
        appLoading(false);
    }

    handleChangeSearchText = (value) => {
        this.setState({searchText: value});
    }

    handleSearchOrders = async () => {
        try{
            let orders = await getOrders(this.state.searchText);
            if(!orders || !orders.length){
                orders = [];
                open_appAlert({
                    showConfirm: true,
                    cancelTitle: "Thoát",
                    submitTitle: "Ok",
                    onClickSubmit: () => open_appAlert(null),
                    onClickCancel: () => open_appAlert(null),
                    title: <div style={{color: "red", textAlign:"center", height: "50px", fontWeight: "bold", fontSize: "20px"}}>Không tìm thấy đơn hàng nào!</div>,
                    message: (
                        <div style={{padding: "20px", marginBottom: "20px", color: "green", textAlign: "justify"}}>
                            Hệ thống không tìm thấy đơn hàng nào của số điện thoại này.<br></br>
                            <span style={{fontStyle: "italic", color: "red"}}>(Hệ thống chỉ chấp nhận số điện thoại chính xác!)</span><br></br>
                            Bạn vui lòng kiểm tra lại SĐT hoặc liên hệ shop hỗ trợ qua messenger!
                        </div>
                    ),
                })
            }
            orders.forEach((order_item, index) => {
                orders[index] = resolveProduct(orders[index]);
            })
            this.setState({orders: orders});
        }catch(err){
            console.log("err");
            this.setState({orders: []});
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        this.handleSearchOrders();
    }

    handleTriggerWarranty = async (order_record_id) => {
        let data = await user_triggerWarranty(order_record_id);
        if(data && data.isSuccess){
            let orders = JSON.parse(JSON.stringify(this.state.orders));
            let match_item = orders.find(item => {return item.record_id == order_record_id});
            match_item.status = "đang bảo hành";
            this.setState({
                orders: orders
            })
            open_appAlert({
                showConfirm: true,
                cancelTitle: "Thoát",
                submitTitle: "Ok",
                title: <div style={{color: "red", textAlign:"center", height: "50px", fontSize: "20px"}}>Kích Hoạt Bảo Hành Thành Công!</div>,
                message: (
                    <div style={{padding: "20px", marginBottom: "20px", color: "green", textAlign: "justify"}}>
                        <p>Shop sẽ liên lạc với bạn qua số điện thoại để tới tận nơi lấy hàng và bảo hành (miễn phí).</p>
                        <p>Xin cảm ơn bạn đã luôn ủng hộ shop!</p>
                    </div>
                ),
            })
        }else{
            open_appAlert({
                showConfirm: true,
                cancelTitle: "Thoát",
                submitTitle: "Ok",
                title: <div style={{color: "red", textAlign:"center", height: "50px", fontSize: "20px"}}>Kích Hoạt Bảo Hành Không Thành Công!</div>,
                message: (
                    <div style={{padding: "20px", marginBottom: "20px", color: "green", textAlign: "justify"}}>
                        <p>Khách hãy inbox messenger shop để shop hỗ trợ nhé.</p>
                        <p>Xin cảm ơn khách đã luôn ủng hộ shop!</p>
                    </div>
                ),
            })
        }
    }

    render() {
        let { searchText, orders } = this.state;
        let order_bills = sortOrderByTimestampId(orders);

        return (
            <React.Fragment>
                <div className="checkOrder">
                    {!orders ? (
                        <div className="bigWrapper">
                            <h1 className="bigTitle">Tra cứu bảo hành</h1>
                            <div className="bigContent">
                                <form onSubmit={(event) => this.handleFormSubmit(event)}>
                                    <input
                                        placeholder="Nhập số điện thoại của bạn..."
                                        className="bigInput"
                                        onChange={(event) => this.handleChangeSearchText(event.target.value)}
                                        value={this.state.searchText}
                                    />
                                    <button
                                        className="bigSubmit"
                                    >Tìm kiếm</button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <React.Fragment>
                            <div className="searchWrapper">
                                <form onSubmit={(event) => this.handleFormSubmit(event)}>
                                    <input
                                        className="smallInput"
                                        placeholder="Nhập số điện thoại của bạn..."
                                        onChange={(event) => this.handleChangeSearchText(event.target.value)}
                                        value={this.state.searchText}
                                    />
                                    <button
                                        className="smallSubmit"
                                    >Tìm kiếm</button>
                                </form>
                            </div>
                            <div className="title">Kết quả tìm kiếm...</div>
                            <div className="orderWrapper">
                                {order_bills.map((bill_order, index) => {
                                    let grand_total_check = 0;
                                    return (
                                        <div key={index} className="billWrapper">
                                            <div className="billTitle">
                                                <span>SĐT: {unescape(bill_order.products[0].user_tel)}</span>
                                                <span>Khách: {unescape(bill_order.products[0].user_name)}</span>
                                                <span>Địa chỉ: {unescape(bill_order.products[0].user_address)}</span>
                                                <span>Ngày đặt: {convertTimeStamp(parseInt(unescape(bill_order.timestamp_id)))}</span>
                                            </div>
                                            {bill_order.products.map((order, prod_index) => {
                                                let prod_thumb = (order.prod_thumb && order.prod_thumb != "") ? unescape(order.prod_thumb) : unescape(order.prod_img);
                                                if(!prod_thumb) prod_thumb = "";
                                                prod_thumb = prod_thumb.split("imgSpliter_TKH")[0];
                                                let prod_name = (order.prod_name && order.prod_name != "") ? unescape(order.prod_name) : (order.sup_name ? unescape(order.sup_name) : "");
                                                let prod_link = prod_name.replace(/[\s+,+\.+(+)+\\+\/+]/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "").toLowerCase();
                                                prod_link = removeVnCharacter(prod_link);
                                                prod_link = `/${prod_link}_pro${order.prod_id}`;

                                                let saleoff_percent = parseFloat(order.saleoff_percent) > 0 ? parseFloat(order.saleoff_percent) : 0;
                                                let sale_price = calculateSalePrice(order.prod_price, saleoff_percent);
                                                let total_check = sale_price * order.order_qty;
                                                grand_total_check += total_check;
                                                let isWarranty = checkWarranty(order.timestamp_id, order.warranty);
                                                if(order.order_qty <= 0) isWarranty = false;
                                                if(order.status != "đã giao") isWarranty = false;
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
                                                        value={order.note ? unescape(order.note) : ""}
                                                      />
                                                    </div>
                                                    <div className="priceGroup">
                                                        <span>Đơn giá:</span>
                                                        {saleoff_percent > 0 ? <span className="rootPrice">{order.prod_price.toLocaleString()}</span> : null}
                                                        <span className="prodPrice">{sale_price.toLocaleString()}</span>
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
                                                        Bảo hành: {<span>{convertWarrantyPeriod(unescape(order.warranty))}</span>}<br></br>
                                                        Đến ngày: {<span>{convertWarrantyExpire(unescape(order.timestamp_id), unescape(order.warranty))}</span>}
                                                    </div>
                                                    <div className="status">
                                                        tình trạng<br></br>
                                                        <input
                                                            disabled
                                                            value={order.status != null ? order.status : ""}
                                                            style={order.status == "đang bảo hành" ? {color: "#ffa500"} : null}
                                                        />
                                                    </div>
                                                    <button
                                                        className="requestWarranty"
                                                        style={isWarranty ? null : {opacity: "0.5", cursor: "auto"}}
                                                        onClick={isWarranty ? () => this.handleTriggerWarranty(order.record_id) : null}
                                                    >Yêu cầu bảo hành</button>
                                                  </div>
                                                )
                                            })}
                                            <div className="grandTotal">Tổng cộng: {grand_total_check.toLocaleString()}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(CheckOrder);