import React from "react";
import { connect } from "react-redux";
import { convertTimeStamp, resolveProduct, removeVnCharacter } from "../../../utils/functions";
import { appLoading, open_appAlert } from "../../../utils/appFunction";
import {
  admin_getAllProducts,
  updateSupInfo,
  updateProducts,
  addProduct,
  initProduct,
  deleteProduct
} from "../../../api/apiAdmin";
import { getSidebarLinks } from "../../../api/apiCall";
import "./Product.css";
import ProductDetailEditor from "./ProductDetailEditor";
import ProductAdd from "./ProductAdd";
import $ from "jquery";

let warrantyOptions = [<option key="test" value={0}>Test</option>];
let warranty_day_period = [3, 7, 15, 30, 45, 60, 90];
let warranty_month_period = [4, 6, 9, 12, 15, 18, 21, 24, 30, 36];
for(let i = 0; i < warranty_day_period.length; i ++){
  let timestamp_length = warranty_day_period[i]*24*60*60*1000;
  warrantyOptions.push(<option key={timestamp_length} value={timestamp_length}>{warranty_day_period[i]} ngày</option>)
}
for(let i = 0; i < warranty_month_period.length; i ++){
  let timestamp_length = warranty_month_period[i]*30*24*60*60*1000;
  warrantyOptions.push(<option key={timestamp_length} value={timestamp_length}>{warranty_month_period[i]} tháng</option>)
}

let initialSort = {
  supplier: "",   // "---", "https://phatdatcomputer.vn", "https://phatdatbinhthoi.com.vn", "other"
  prod_stock: "", // "---", "YES", "NO"
  last_updated: "", // "---" "YES", "NO"
  category: "",   // "---", "category_path"
  onsale: "",     // "---", "YES", "NO"
  prod_trend: "", // "---", "DESC", "ASC"
  prod_name: "",  // "prod_name"
  isNew: "---",   // "sup_name",
}

class Product extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      products: [],
      showed_products: [],
      category: [],
      sort: {...initialSort},
      img_edit_prod: {},
      img_edit_ori_prod: {},
      addProduct: false,
    }
  }

  setStateAsync = (object) => {
    return new Promise((resolve, reject) => {
      this.setState(object, () => {
        resolve();
      });
    })
  }

  componentDidMount = async() => {
    try{
      let products = await admin_getAllProducts();
      products.forEach((product, index) => {
        products[index] = resolveProduct(product);
      })
      let category = await getSidebarLinks();
      await this.setStateAsync({
        products: products,
        category: category
      });
      this.sortData();
      appLoading(false);
    }catch(err){
      console.log(err);
      appLoading(false);
    }
  }

  checkProductMatchSort = (product_item) => {
    let { sort } = this.state;
    let isAccepted = true;
    // sort by supplier
    if(sort.supplier && sort.supplier != "other" && sort.supplier != "---"){
      if(product_item.prod_link.indexOf(sort.supplier) < 0) isAccepted = false;
    }else if(sort.supplier == "other"){
      if(product_item.prod_link.indexOf("https://phatdatcomputer.vn") > -1 || product_item.prod_link.indexOf("https://phatdatbinhthoi.com.vn") > -1){
        isAccepted = false;
      }
    }
    // sort by prod_stock
    if((sort.prod_stock == "YES" && !(product_item.prod_stock > 0)) || (sort.prod_stock == "NO" && !(product_item.prod_stock <= 0))){
      isAccepted = false;
    }
    // sort by last_updated
    if((sort.last_updated == "YES" && !(parseInt(product_item.last_updated) > 0)) || (sort.last_updated == "NO" && !(parseInt(product_item.last_updated) == 0))){
      isAccepted = false;
    }
    // sort by onsale
    if(sort.onsale == "YES" && !(product_item.saleoff_percent != null && product_item.saleoff_percent != "" && product_item.saleoff_percent != "null" && product_item.saleoff_percent > 0)){
      isAccepted = false;
    }
    if(sort.onsale == "NO" && !(product_item.saleoff_percent != null && product_item.saleoff_percent != "" && product_item.saleoff_percent != "null" && product_item.saleoff_percent <= 0)){
      isAccepted = false;
    }
    // sort by category
    if(sort.category && sort.category != "" && sort.category != "---"){
      if(product_item.category.indexOf(sort.category) < 0) isAccepted = false;
    }
    // sort by prod_name
    if(sort.prod_name && sort.prod_name != ""){
      let isMatch = false;
      let searcNameField = ["prod_name", "sup_name", "s_key"];
      searcNameField.forEach(attr_item => {
        if(product_item[attr_item] && removeVnCharacter(product_item[attr_item]).toUpperCase().indexOf(removeVnCharacter(sort.prod_name).toUpperCase()) > -1)
        isMatch = true;
      })
      if(!isMatch) isAccepted = false;
    }
    // sort by isNew
    if((sort.isNew == "YES" && (product_item.sup_name != null && product_item.sup_name != "")) || (sort.isNew == "NO" && (product_item.sup_name == null || product_item.sup_name == ""))){
      isAccepted = false;
    }
    return isAccepted;
  }

  sortData = () => {
    appLoading(true);
    let { products, sort } = this.state;
    let showed_products = [];
    products.forEach(product_item => {
      let isAccepted = this.checkProductMatchSort(product_item);
      if(isAccepted) showed_products.push({...product_item});
    })
    // sort by prod_trend
    if(sort.prod_trend == "ASC") showed_products.sort((a, b) => {return a.prod_trend - b.prod_trend});
    if(sort.prod_trend == "DESC") showed_products.sort((a, b) => {return b.prod_trend - a.prod_trend});
    this.setState({ showed_products: showed_products });
    appLoading(false);
  }

  changeProductInfo = (prod_id, options) => {
    let state_showed_products = this.state.showed_products;
    let showed_products = JSON.parse(JSON.stringify(state_showed_products));
    let match_item = showed_products.find(item => {return item.prod_id == prod_id});
    for(let i in options){
      match_item[i] = options[i];
    }
    this.setState({ showed_products: showed_products });
  }

  handleChangeSortAttr = (event) => {
    let sort = {...this.state.sort};
    sort[event.target.name] = event.target.value;
    this.setState({sort: sort});
  }

  clearSort = () => {
    this.setState({
      sort: {...initialSort}
    })
  }

  handleAddProduct = async (isOpen, prod) => {
    if(isOpen){
      this.setState({addProduct: true});
    }else{
      this.setState({addProduct: false});
    }
    if(prod){
      // gọi api thêm product, server trả về product thì set state vào products
      if(!prod.prod_link || prod.prod_link == "" || !prod.category || prod.category == ""){
        open_appAlert({
          showConfirm: true,
          title: <div style={{textAlign: "center", color: "red", fontStyle: "italic", margin: "20px"}}>vui lòng nhập đủ link và danh mục sản phẩm!</div>,
          cancelTitle: "cancel",
          submitTitle: "ok",
          onClickSubmit: () => this.handleAddProduct(true)
        })
      }else{
        let data = await addProduct([prod]);
        if(data.isSuccess){
          open_appAlert({
            timeOut: 5000,
            showConfirm: true,
            title: <div style={{textAlign: "center", color: "green", fontStyle: "italic", margin: "20px"}}>thêm thành công! Reload lại trang để cập nhật sản phẩm mới!</div>,
            cancelTitle: "add another",
            onClickCancel: () => this.handleAddProduct(true),
            submitTitle: "ok",
          })
        }
      }
    }
  }

  handleSaveChanges = async (products) => {
    // gọi api update product, server trả về product thì set state vào products
    appLoading(true);
    let data = await updateProducts(products);
    if(data.updated_products && data.updated_products.length > 0){
      this.update_showed_products_n_products_when_receive_new_product(data.updated_products);
    }
    appLoading(false);
  }

  confirmDeleteProduct = product_id => {
    let products = this.state.products;
    let prod_name_li = "";
    let match_product = products.find(prod_item => {return prod_item.prod_id == product_id});
    if(match_product) prod_name_li = <li style={{color: "red"}}>xóa: {match_product.prod_name && match_product.prod_name != "" ? match_product.prod_name : match_product.sup_name}</li>;
    open_appAlert({
      showConfirm: true,
      title: <div style={{textAlign: "center", color: "red", fontStyle: "italic", margin: "20px"}}>{prod_name_li}</div>,
      cancelTitle: "cancel",
      submitTitle: "ok",
      onClickSubmit: () => this.handleDeleteProduct(product_id)
    })
  }
  // can not send body entity with delete request (at least currently)
  handleDeleteProduct = async (product_id) => {
    // gọi api xóa product, server trả về success thì set state vào products
    appLoading(true);
    let data = await deleteProduct(product_id);
    if(data.isSuccess){
      await this.update_showed_products_n_products_when_delete_product([product_id]);
    }
    appLoading(false);
  }

  handleInitProduct = async (product_ids) => {
    appLoading(true);
    let data = await initProduct(product_ids);
    if(data.updated_products && data.updated_products.length > 0){
      await this.update_showed_products_n_products_when_receive_new_product(data.updated_products);
    }
    appLoading(false);
  }

  handleUpdateSupInfo = async (product_ids) => {
    // gọi api update sup info product, server trả về product thì set state vào products
    appLoading(true);
    let data = await updateSupInfo(product_ids);
    let { updated_products, failed_products, err_message } = data;
    let number_of_updated = updated_products ? updated_products.length : 0;
    let number_of_failed = failed_products ? failed_products.length : product_ids.length;
    let err_alert = err_message ? err_message.split("-imgSpliter_TKH-").map((message_item, index) => {
      return <li key={index}>{message_item}</li>
    }) :null;

    // update showed_products state
    if(updated_products && updated_products.length > 0){
      this.update_showed_products_n_products_when_receive_new_product(updated_products);
    }
    appLoading(false);
  }

  handleManipulateAll = (function_type, data) => {
    // function_type: "update_sup_info_all", "save_all_change", "initial_all"
    if(function_type == "save_all_change"){
      open_appAlert({
        showConfirm: true,
        title: <div style={{textAlign: "center", color: "red", fontStyle: "italic", margin: "20px"}}>
                <p>save_all_change?</p>
                <p>this function might not work properly</p>
                <p>still proceed?</p>
              </div>,
        cancelTitle: "cancel",
        submitTitle: "ok",
        onClickSubmit: () => this.handleSaveChanges(data)
      })
    }
    if(function_type == "update_sup_info_all"){
      open_appAlert({
        showConfirm: true,
        title: <div style={{textAlign: "center", color: "red", fontStyle: "italic", margin: "20px"}}>update_sup_info_all?</div>,
        cancelTitle: "cancel",
        submitTitle: "ok",
        onClickSubmit: () => this.handleUpdateSupInfo(data)
      })
    }
    if(function_type == "initial_all"){
      open_appAlert({
        showConfirm: true,
        title: <div style={{textAlign: "center", color: "red", fontStyle: "italic", margin: "20px"}}>initial_all?</div>,
        cancelTitle: "cancel",
        submitTitle: "ok",
        onClickSubmit: () => this.handleInitProduct(data)
      })
    }
  }

  openImgDesReviewEditor = (isOpen, prod, ori_prod) => {
    if(!isOpen){
      this.setState({
        img_edit_prod: {},
        img_edit_ori_prod: {}
      })
      $("body").css("overflow", "auto");
    }else{
      this.setState({
        img_edit_prod: {...prod},
        img_edit_ori_prod: {...ori_prod}
      })
      $("body").css("overflow", "hidden");
    }
  }

  updateProdImgDesReview = prod => {
    let { showed_products } = this.state;
    let match_item = showed_products.find(item => {
      return item.prod_id == prod.prod_id;
    })
    for(let i in match_item){
      match_item[i] = prod[i];
    }
    this.setState({
      show_products: showed_products,
      img_edit_prod: {},
      img_edit_ori_prod: {}
    });
  }

  update_showed_products_n_products_when_receive_new_product = (updated_products) => {
    return new Promise((resolve, reject) => {
      let showed_products = JSON.parse(JSON.stringify(this.state.showed_products));
      let products = JSON.parse(JSON.stringify(this.state.products));
      updated_products.forEach((new_prod_item, index) => {
        updated_products[index] = resolveProduct(updated_products[index]);
      })
      updated_products.forEach((new_prod_item, index) => {
        // xóa products cũ ở showed_products state
        let showed_product_match_prod_item = showed_products.find(old_prod_item => {
          return old_prod_item.prod_id == new_prod_item.prod_id
        })
        let showed_product_replace_index = showed_products.indexOf(showed_product_match_prod_item);
        showed_products.splice(showed_product_replace_index, 1);
        // thêm products mới vào showed_products state
        let isShowed = this.checkProductMatchSort(new_prod_item);
        if(isShowed) showed_products.splice(showed_product_replace_index, 0, {...new_prod_item});

        // xóa products cũ ở products state và thêm products mới vào
        let products_match_prod_item = products.find(old_prod_item => {
          return old_prod_item.prod_id == new_prod_item.prod_id
        })
        let products_replace_index = products.indexOf(products_match_prod_item);
        products.splice(products_replace_index, 1, {...new_prod_item});
      })
      // sort by prod_trend
      let sort = this.state.sort;
      if(sort.prod_trend == "ASC") showed_products.sort((a, b) => {return a.prod_trend - b.prod_trend});
      if(sort.prod_trend == "DESC") showed_products.sort((a, b) => {return b.prod_trend - a.prod_trend});
      this.setState({
        showed_products: showed_products,
        products: products
      }, () => resolve());
    })
  }

  update_showed_products_n_products_when_delete_product = (product_ids) => {
    return new Promise((resolve, reject) => {
      let showed_products = JSON.parse(JSON.stringify(this.state.showed_products));
      let products = JSON.parse(JSON.stringify(this.state.products));
      product_ids.forEach(id_item => {
        // delete ở showed_products state
        let match_index_showed_products;
        for(let i = 0; i < showed_products.length; i++){
          if(showed_products[i].prod_id == id_item){
            match_index_showed_products = i;
            break;
          }
        }
        if(match_index_showed_products != null){ // phải đặt là != null vì trường hợp index == 0 trả về false trong lệnh if
          showed_products.splice(match_index_showed_products, 1);
        }

        // delete ở products state
        let match_index_products;
        for(let i = 0; i < products.length; i++){
          if(products[i].prod_id == id_item){
            match_index_products = i;
            break;
          }
        }
        if(match_index_products != null) products.splice(match_index_products, 1);
      })
      this.setState({
        showed_products: showed_products,
        products: products
      }, () => resolve());
    })
  }

  render() {
    let { showed_products, products, category, sort, img_edit_prod, img_edit_ori_prod, addProduct } = this.state;
    let sort_attr= ["supplier", "category", "prod_stock", "onsale", "prod_trend", "prod_name"];
    return (
      <React.Fragment>
        {/* img editor */}
        {img_edit_prod && img_edit_prod.prod_id ? (
          <ProductDetailEditor
            prod={img_edit_prod}
            ori_prod={img_edit_ori_prod}
            onCancel={() => this.openImgDesReviewEditor(false)}
            onSubmit={(prod) => this.updateProdImgDesReview(prod)}
          />
        ) : null}

        {/* add product */}
        {addProduct ? (
          <ProductAdd
            categories={category}
            onCancel={() => this.handleAddProduct(false, null)}
            onSubmit={(prod) => this.handleAddProduct(false, prod)}
          />
        ) : null}

        {/* main content */}
        <div className="AdminProduct">
          <div className="adminProductWrapper">
            <div className="sorter">
              <span className="supplier">
                supplier
                <select
                  value={sort.supplier}
                  name="supplier"
                  onChange={(event) => this.handleChangeSortAttr(event)}
                >
                  <option value="---">---</option>
                  <option value="https://phatdatbinhthoi.com.vn">Phát đạt bình thới</option>
                  <option value="https://phatdatcomputer.vn">Phát đạt computer</option>
                  <option value="other">Other</option>
                </select>
              </span>
              <span className="category">
                category
                <select
                  value={sort.category}
                  name="category"
                  onChange={(event) => this.handleChangeSortAttr(event)}
                >
                  <option value="---">---</option>
                  {category.map((cat_item, index) => {
                    return (
                      <option key={index} value={cat_item.category_path}>{cat_item.category_name}</option>
                    )
                  })}
                </select>
              </span>
              <span className="prod_stock">
                prod_stock
                <select
                  value={sort.prod_stock}
                  name="prod_stock"
                  onChange={(event) => this.handleChangeSortAttr(event)}
                >
                  <option value="---">---</option>
                  <option value="YES">Còn hàng</option>
                  <option value="NO">Hết hàng</option>
                </select>
              </span>
              <span className="last_updated">
                last_updated
                <select
                  value={sort.last_updated}
                  name="last_updated"
                  onChange={(event) => this.handleChangeSortAttr(event)}
                >
                  <option value="---">---</option>
                  <option value="YES">Chờ duyệt</option>
                  <option value="NO">Đã duyệt</option>
                </select>
              </span>
              <span className="onsale">
                onsale
                <select
                  value={sort.onsale}
                  name="onsale"
                  onChange={(event) => this.handleChangeSortAttr(event)}
                >
                  <option value="---">---</option>
                  <option value="YES">Đang sale</option>
                  <option value="NO">Không sale</option>
                </select>
              </span>
              <span className="prod_trend">
                prod_trend
                <select
                  value={sort.prod_trend}
                  name="prod_trend"
                  onChange={(event) => this.handleChangeSortAttr(event)}
                >
                  <option value="---">---</option>
                  <option value="DESC">Giảm dần</option>
                  <option value="ASC">Tăng dần</option>
                </select>
              </span>
              <span className="prod_name">
                prod_name
                <input
                  value={sort.prod_name}
                  placeholder="Tên sản phẩm..."
                  name="prod_name"
                  onChange={(event) => this.handleChangeSortAttr(event)}
                />
              </span>
              <span className="isNew">
                isNew
                <select
                  value={sort.isNew}
                  name="isNew"
                  onChange={(event) => this.handleChangeSortAttr(event)}
                >
                  <option value="---">---</option>
                  <option value="YES">Mới</option>
                  <option value="NO">Cũ</option>
                </select>
              </span>
              <button className="actionSort" onClick={() => this.sortData()}>lọc</button>
              <button className="actionClear" onClick={() => this.clearSort()}>xóa lọc</button>
              <button className="actionAdd" onClick={() => this.handleAddProduct(true)}>thêm SP</button>
            </div>
            <div className="productContent">
              <div className="productContentWrapper">
                <div className="summary">{showed_products.length} products found</div>
                {showed_products.map((prod_item, index) => {
                  let match_item = products.find(item => {return item.prod_id == prod_item.prod_id}) || {};
                  return (
                    <div key={index} className="productItemWrapper">
                      <div className="prod_order"># {index + 1}</div>
                      <div className="thumb">
                        <img 
                          src={prod_item.prod_thumb || ""} 
                          alt={prod_item.prod_name}
                          style={prod_item.prod_thumb == match_item.prod_thumb ? null : {border: "1px solid red"}}
                        ></img>
                      </div>
                      <div className="name">
                        <p className="sup_name">
                          sup_name
                          <a href={prod_item.prod_link} target="blank">
                            <input
                              disabled={true}
                              value={prod_item.sup_name || ""}
                            />
                          </a>
                        </p>
                        <p className="prod_name">
                          prod_name
                          <input
                           value={prod_item.prod_name || ""}
                           onChange={(event) => this.changeProductInfo(prod_item.prod_id, {prod_name: event.target.value})}
                           style={prod_item.prod_name == match_item.prod_name ? null : {color: "red"}}
                          />
                        </p>
                        <p className="s_key">
                          s_key
                          <input
                            value={prod_item.s_key || ""}
                            onChange={(event) => this.changeProductInfo(prod_item.prod_id, {s_key: event.target.value})}
                            style={prod_item.s_key == match_item.s_key ? null : {color: "red"}}
                          />
                        </p>
                      </div>
                      <div className="price">
                        <p className="sup_price">
                          sup_price
                          <input
                            disabled={true}
                            value={prod_item.sup_price != null ? prod_item.sup_price.toLocaleString() : ""}
                          />
                        </p>
                        <p className="prod_price">
                          prod_price
                          <input
                            value={prod_item.prod_price != null ? prod_item.prod_price : ""}
                            type="number"
                            onChange={(event) => this.changeProductInfo(prod_item.prod_id, {prod_price: event.target.value})}
                            style={prod_item.prod_price == match_item.prod_price ? null : {color: "red"}}
                          />
                        </p>
                        <p className="saleoff_percent">
                          saleoff_percent
                          <input
                            value={prod_item.saleoff_percent != null ? prod_item.saleoff_percent : ""}
                            type="number"
                            onChange={(event) => this.changeProductInfo(prod_item.prod_id, {saleoff_percent: event.target.value})}
                            style={prod_item.saleoff_percent == match_item.saleoff_percent ? null : {color: "red"}}
                          />
                        </p>
                      </div>
                      <div className="cat-trend-war-stock">
                        <p className="category">
                          category
                          <input 
                            value={prod_item.category || ""}
                            onChange={(event) => this.changeProductInfo(prod_item.prod_id, {category: event.target.value})}
                            style={prod_item.category == match_item.category ? null : {color: "red"}}
                          />
                        </p>
                        <p className="trend-stock">
                          <span className="prod_trend">
                            prod_trend
                            <input 
                              type="number"
                              value={prod_item.prod_trend != null ? prod_item.prod_trend : ""}
                              onChange={(event) => this.changeProductInfo(prod_item.prod_id, {prod_trend: event.target.value})}
                              style={prod_item.prod_trend == match_item.prod_trend ? null : {color: "red"}}
                            />
                          </span>
                          <span className="prod_stock">
                            prod_stock
                            <input 
                              type="number"
                              value={prod_item.prod_stock != null ? prod_item.prod_stock : ""}
                              onChange={(event) => this.changeProductInfo(prod_item.prod_id, {prod_stock: event.target.value})}
                              style={prod_item.prod_stock == match_item.prod_stock ? null : {color: "red"}}
                            />
                          </span>
                        </p>
                        <p className="warranty">
                          <span>
                            sup_warranty
                            <input
                              disabled={true}
                              value={prod_item.sup_warranty || ""}
                            />
                          </span>
                          <span>
                            warranty
                            <select
                              value={prod_item.warranty || ""}
                              onChange={(event) => this.changeProductInfo(prod_item.prod_id, {warranty: event.target.value})}
                              style={prod_item.warranty == match_item.warranty ? null : {color: "red"}}
                            >
                              <option value="---">---</option>
                              {warrantyOptions.map(item => {return item})}
                            </select>
                          </span>
                        </p>
                      </div>
                      <div className="updateInfo">
                        <p className="last_updated">
                          last_updated:
                          <span>{convertTimeStamp(parseInt(prod_item.last_updated), "HHhMM dd-mm-yyyy")}</span>
                          <input
                            value={prod_item.last_updated != null ? prod_item.last_updated : ""}
                            type="text"
                            onChange={(event) => this.changeProductInfo(prod_item.prod_id, {last_updated: event.target.value})}
                            style={prod_item.last_updated == match_item.last_updated ? null : {color: "red"}}
                          />
                        </p>
                        <div
                          className="updated_info"
                        >
                          <ul
                            dangerouslySetInnerHTML={{__html: prod_item.updated_info || ""}}
                          ></ul>
                        </div>
                      </div>
                      <div className="action">
                        <button
                          className="img-des-review"
                          onClick={() => this.openImgDesReviewEditor(true, {...prod_item}, {...match_item})}
                        >
                          open img
                        </button>
                        <button
                          className="save"
                          onClick={() => this.handleSaveChanges([{...prod_item}])}
                        >
                          save changes
                        </button>
                        <button
                          className="update"
                          onClick={() => this.handleUpdateSupInfo([prod_item.prod_id])}
                        >
                          update sup info
                        </button>
                        <button
                          className="delete"
                          onClick={() => this.confirmDeleteProduct(prod_item.prod_id)}
                        >
                          delete
                        </button>
                        <button
                          className="prodInit"
                          onClick={() => this.handleInitProduct([prod_item.prod_id])}
                        >
                          initial product
                        </button>
                      </div>
                    </div>
                  )
                })}
                {/* function_type: "update_sup_info_all", "save_all_change", "initial_all" */}
                <div className="bottomActionBar">
                  <button className="saveAll"
                    onClick={() => this.handleManipulateAll("save_all_change", this.state.showed_products)}
                  >save all changes</button>
                  <button className="updateSupInfoAll"
                    onClick={() => this.handleManipulateAll("update_sup_info_all", this.state.showed_products.map(item => {return item.prod_id}))}
                  >update supinfo all</button>
                  <button className="prodInitAll"
                    onClick={() => this.handleManipulateAll("initial_all",  this.state.showed_products.map(item => {return item.prod_id}))}
                  >initial all</button>
                </div>
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
        
    }
};

export default connect(mapStateToProps)(Product);