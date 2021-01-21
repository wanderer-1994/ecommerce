import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import queryString from "query-string";
import { getProducts } from "../../../api/apiCall";
import { addToCart, appLoading } from "../../../utils/appFunction";
import {
  removeVnCharacter,
  resolveProduct,
  calculateSalePrice,
  toggleSidebar
} from "../../../utils/functions";
import "./Pagination.css";
import "./ProdShow.css";
import "./QuickMenu.css";
import HeadPhone from "../../../assets/headphone.png";
import Music from "../../../assets/music.png";
import UsbCable from "../../../assets/usbcable.svg";
import Menu from "@material-ui/icons/Menu";

class UserHomePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      products: [],
      currentPage: 1,
      totalPages: 1,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    let old_query = queryString.parse(this.props.location.search);
    let new_query = queryString.parse(nextProps.location.search);
    let isLoad = false;
    for(let i in new_query){
      if(new_query[i] != old_query[i]){
        isLoad = true;
        let page = new_query.page;
        this.loadData(page);
        break;
      }
    };
    if(!isLoad){
      for(let i in old_query){
        if(new_query[i] != old_query[i]){
          let page = new_query.page;
          this.loadData(page);
          break;
        }
      }
    }
  }

  componentDidMount = () => {
    let query = queryString.parse(this.props.location.search);
    let page = query.page;
    if(!page) page = 1;
    this.loadData(page);
  }

  loadData = async (page) => {
    try{
      appLoading(true);
      if(!page || page < 1) page = 1;
      let data = await getProducts(`/api/product-user?page=${page}`);
      this.setState({
        products: data.products || [],
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
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
    let { totalPages, currentPage, products } = this.state
    let paginationItems = [];
    for(let i = 1; i <= totalPages; i++){
      paginationItems.push(
        <span
          className={i == currentPage ? "paginationItem active" : "paginationItem"}
          key={i}
        ><Link
          to={`/?page=${i}`}
          onClick={i == currentPage ? null : () => window.scrollTo(0, 0)}
        >{i}</Link>
        </span>
      )
    }
    return (
      <React.Fragment>
        <div className="quickMenu">
          <div className="quickMenuWrapper">
            <Link to="/tai-nghe-loa_cat.tai-nghe-loa">
              <img src={HeadPhone}/>
              tai nghe
            </Link>
            <Link to="/cap-coc-sac_cat.cap-coc-sac">
              <img src={UsbCable}/>
              cáp sạc
            </Link>
            <Link to="/do-choi-cute_cat.do-choi-cute">
              <img src={Music}/>
              hot trend
            </Link>
            <a onClick={() => toggleSidebar()}>
              <Menu/>
              khác
            </a>
          </div>
        </div>
        <div className="prodShow">
          <div className="prodShowWrapper">
            {products.map((prod_item, index) => {
              let item = resolveProduct(prod_item);
              let prod_name = (item.prod_name && item.prod_name != "") ? item.prod_name : item.sup_name;
              let prod_url = prod_name.replace(/[\s+,+\.+(+)+\\+\/+]/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "").toLowerCase();
              prod_url = removeVnCharacter(prod_url);
              let prod_link = `/${prod_url}_pro${item.prod_id}`;
              let prod_img = (item.prod_thumb && item.prod_thumb != "") ? item.prod_thumb : item.prod_img.split("imgSpliter_TKH")[0];
              let prod_review = item.prod_review;
              if(!prod_review || !prod_review.length || prod_review.length < 11){
                prod_review = prod_name.replace(/-+/g, "+");
                prod_review = `https://www.youtube.com/results?search_query=${prod_review}`
              }
              let saleoff_percent = parseFloat(item.saleoff_percent) > 0 ? parseFloat(item.saleoff_percent) : 0;
              let sale_price = calculateSalePrice(item.prod_price, saleoff_percent);
              return (
                <div className="prodBox" key={index}>
                  <div className="prodImg">
                    <Link to={prod_link}>
                      <img src={prod_img} alt={prod_name}></img>
                    </Link>
                  </div>
                  <div className="priceGroup">
                    {saleoff_percent > 0 ? <span className="rootPrice">{item.prod_price.toLocaleString()}</span> : null}
                    <span className="prodPrice">{sale_price.toLocaleString()}</span>
                    {saleoff_percent > 0 ? <span className="saleInfo">{`-${saleoff_percent.toLocaleString()}%`}</span> : null}
                  </div>
                  <div className="prodName"><Link to={prod_link}>{prod_name}</Link></div>
                  <div className="prodReviewLink"><a href={prod_review} target="blank">xem review &gt;&gt;</a></div>
                  <div className="prodAction">
                    <button className="addToCart" onClick={(event) => this.handleAddToCart(event.target, prod_img, item)}>thêm vào giỏ</button>
                    <Link to="/gio-hang">
                      <button onClick={(event) => this.handleAddToCart(event.target, prod_img, item)}>mua ngay</button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="Pagination">
          <div className="paginationWrapper">
            {paginationItems.map(item => {
              return item;
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

export default connect(mapStateToProps)(withRouter(UserHomePage));