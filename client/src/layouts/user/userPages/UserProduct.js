import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import queryString from "query-string";
import { getProducts } from "../../../api/apiCall";
import { addToCart, appLoading } from "../../../utils/appFunction";
import { resolveProduct, calculateSalePrice, convertWarrantyPeriod } from "../../../utils/functions";
import PageNotFound from "./PageNotFound";
import "./UserProduct.css";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";

class UserProduct extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      product: {},
      prodImg: "",
      upSellProd: [],
      bestSellProd: []    
    }
  }

  componentWillReceiveProps = (nextProps) => {
    let old_pathName = this.props.match.params.url;
    let new_pathName = nextProps.match.params.url;
    if(old_pathName != new_pathName){
      this.loadData(new_pathName);
    }
  }

  componentDidMount = () => {
    let path_name = this.props.match.params.url;
    this.loadData(path_name);
    window.scrollTo(0, 0);
  }

  loadData = async (path_name) => {
    try{
      appLoading(true);
      let prod_id = path_name.split("_pro")[1];
      let data = await getProducts(`/api/product-user?prod_id=${prod_id}`);
      let prodImg = (data.products[0] && data.products[0].prod_img) ? unescape(data.products[0].prod_img).split("imgSpliter_TKH")[0] : "";
      this.setState({
        product: data.products[0],
        prodImg: prodImg
      });
      if(data.products[0]){
        let upSellProd_data = await getProducts(`/api/product-user?category=${data.products[0].category}&page=1`);
        let upSellProd = upSellProd_data.products;
        upSellProd.forEach((item, index) => {
          if(item.prod_id == data.products[0].prod_id) upSellProd.splice(index, 1);
        })
        this.setState({ upSellProd: upSellProd });
        let bestSellProd_data = await getProducts(`/api/product-user?category=/do-choi-cute&page=1`);
        let bestSellProd = bestSellProd_data.products;
        bestSellProd.forEach((item, index) => {
          if(item.prod_id == data.products[0].prod_id) bestSellProd.splice(index, 1);
        })
        this.setState({ bestSellProd: bestSellProd })
      }
      appLoading(false);
    }catch(err){
      console.log(err);
    }
  }

  handleAddToCart = (target, img_url, product) => {
    let order = {
      prod_id: product.prod_id,
      order_qty: 1,
      note: ""
    }
    addToCart(target, img_url, order);
  }

  render() {
    let product = {...this.state.product};
    product = resolveProduct(product);
    let { prodImg, upSellProd, bestSellProd } = this.state;

    let prod_name = (product.prod_name && product.prod_name != "") ? product.prod_name : product.sup_name;
    if(!prod_name) prod_name = "";
    let prod_review = product.prod_review;
    if(!prod_review || !prod_review.length || prod_review.length < 11){
      prod_review = prod_name.replace(/-+/g, "+");
      prod_review = `https://www.youtube.com/results?search_query=${prod_review}`
    }
    let prod_category_path = (product && product.category) ? product.category.split(",")[0] : "";
    let pre_category_path = prod_category_path.split("/");
    pre_category_path = pre_category_path[pre_category_path.length - 1];
    let post_category_path = prod_category_path.replace(/\//g, ".");
    prod_category_path = `/${pre_category_path}_cat${post_category_path}`;

    let saleoff_percent = parseFloat(product.saleoff_percent) > 0 ? parseFloat(product.saleoff_percent) : 0;
    let sale_price = calculateSalePrice(product.prod_price, saleoff_percent);
    return (
      <React.Fragment>
        {!product || !product.prod_id ? (
          <React.Fragment>
            <div className="emptyAlert"
              style={{textAlign: "center", marginTop: "40px", color: "#00000095"}}
            >
              <p style={{marginBottom: "10px"}}>SẢN PHẨM ĐÃ HẾT HÀNG HOẶC KHÔNG TỒN TẠI</p>
              <p>SHOP RẤT TIẾC VÌ SỰ BẤT TIỆN NÀY!</p>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="prodDetail">
              <div className="backBar">
                <div
                  className="backButton"
                  onClick={() => this.props.history.goBack()}
                ><ArrowBackIos/><ArrowBackIos/></div>
              </div>
              <div className="prodDetailWrapper">
                <div className="imgContainer">
                  <div className="mainImg">
                    <img src={prodImg} alt={prod_name}></img>
                  </div>
                  <div className="miniImgs">
                    {product.prod_img ? product.prod_img.split("imgSpliter_TKH").map((item, index) => {
                      return(
                        <img
                          className={(item == prodImg) ? "active" : ""}
                          key={index} src={item} alt={prod_name}
                          onClick={() => this.setState({prodImg: item})}
                        ></img>
                      )
                    }) : null}
                  </div>
                </div>
                <div className="prodInfo">
                  <h1 className="prodName">{prod_name}</h1>
                  <li className="prodWarranty">{`Bảo hành: ${convertWarrantyPeriod(product.warranty)}`}</li>
                  <li className="priceGroup">Giá: 
                    {saleoff_percent > 0 ? <span className="rootPrice">{product.prod_price.toLocaleString()}đ</span> : null}
                    <span className="prodPrice">{sale_price.toLocaleString()}đ</span>
                    {saleoff_percent > 0 ? <span className="saleInfo">{`-${saleoff_percent.toLocaleString()}%`}</span> : null}
                  </li>
                  <div className="prodReviewLink"><a href={prod_review} target="blank">xem review >></a></div>
                  <div className="prodAction">
                    <button className="addToCart" onClick={(event) => this.handleAddToCart(event.target, prodImg, product)}>Thêm vào giỏ</button>
                    <Link to="/gio-hang">
                      <button className="buyNow" onClick={(event) => this.handleAddToCart(event.target, prodImg, product)}>Mua ngay</button>
                    </Link>
                  </div>
                  {product.prod_description && product.prod_description.length && product.prod_description.length > 11 ? (
                    <div
                      className="prodDescription"
                      dangerouslySetInnerHTML={{__html: product.prod_description || ""}}
                    ></div>
                  ) : (
                    <div className="prodDescription">
                      Mô tả sản phẩm shop chưa cập nhật kịp. <br></br>
                      Khách click vào link review bên trên để xem chi tiết nhé!
                    </div>
                  )}
                </div>
              </div>
            </div>
          
            <div className="upSellProd similarProd">
              <div className="upSellProdWrapper">
                <div className="title">
                  <Link
                    onClick={() => window.scrollTo(0, 0)}
                    to={prod_category_path}>
                    <h1>Sản phẩm tương tự</h1>
                    <span className="shape"></span>
                  </Link>
                </div>
                <div className="prodWrapper">
                  {upSellProd.slice(0, 12).map(prod_item => {
                    let product = resolveProduct(prod_item);
                    let prod_name = (product.prod_name && product.prod_name != "") ? product.prod_name : product.sup_name;
                    if(!prod_name) prod_name = "";
                    let prod_url = prod_name.replace(/[\s+,+\.+(+)+\\+\/+]/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "").toLowerCase();
                    let prodImg = (product.prod_thumb && product.prod_thumb != "") ? product.prod_thumb : product.prod_img.split("imgSpliter_TKH")[0];
                    let prod_link = `/${prod_url}_pro${product.prod_id}`;
                    let saleoff_percent = parseFloat(prod_item.saleoff_percent) > 0 ? parseFloat(prod_item.saleoff_percent) : 0;
                    let sale_price = calculateSalePrice(prod_item.prod_price, saleoff_percent);
                    return (
                      <Link 
                        onClick={() => window.scrollTo(0, 0)}
                        key={product.prod_id} to={prod_link}>
                        <div className="prodBox">
                          <img src={prodImg} alt={prod_name}></img>
                          <div className="priceGroup">
                            {saleoff_percent > 0 ? <span className="rootPrice">{prod_item.prod_price.toLocaleString()}</span> : null}
                            <span className="prodPrice">{sale_price.toLocaleString()}</span>
                            {saleoff_percent > 0 ? <span className="saleInfo">{`-${saleoff_percent.toLocaleString()}%`}</span> : null}
                          </div>
                          <h2 className="prodName">{prod_name}</h2>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="upSellProd">
              <div className="upSellProdWrapper">
                <div className="title">
                  <Link
                    onClick={() => window.scrollTo(0, 0)}
                    to="/do-choi-cute_cat.do-choi-cute">
                    <h1>Sản phẩm hot trend</h1>
                    <span className="shape"></span>
                  </Link>
                </div>
                <div className="prodWrapper">
                  {bestSellProd.slice(0, 12).map(prod_item => {
                    let product = resolveProduct(prod_item);
                    let prod_name = (product.prod_name && product.prod_name != "") ? product.prod_name : product.sup_name;
                    if(!prod_name) prod_name = "";
                    let prod_url = prod_name.replace(/[\s+,+\.+(+)+\\+\/+]/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "").toLowerCase();
                    let prodImg = (product.prod_thumb && product.prod_thumb != "") ? product.prod_thumb : product.prod_img.split("imgSpliter_TKH")[0];
                    let prod_link = `/${prod_url}_pro${product.prod_id}`;
                    let saleoff_percent = parseFloat(prod_item.saleoff_percent) > 0 ? parseFloat(prod_item.saleoff_percent) : 0;
                    let sale_price = calculateSalePrice(prod_item.prod_price, saleoff_percent);
                    return (
                      <Link 
                        onClick={() => window.scrollTo(0, 0)}
                        key={product.prod_id} to={prod_link}>
                        <div className="prodBox">
                          <img src={prodImg} alt={prod_name}></img>
                          <div className="priceGroup">
                            {saleoff_percent > 0 ? <span className="rootPrice">{prod_item.prod_price.toLocaleString()}</span> : null}
                            <span className="prodPrice">{sale_price.toLocaleString()}</span>
                            {saleoff_percent > 0 ? <span className="saleInfo">{`-${saleoff_percent.toLocaleString()}%`}</span> : null}
                          </div>
                          <h2 className="prodName">{prod_name}</h2>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(UserProduct);