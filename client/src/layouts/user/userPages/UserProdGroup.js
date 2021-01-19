import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { getProducts } from "../../../api/apiCall";
import { addToCart, appLoading } from "../../../utils/appFunction";
import { 
  removeVnCharacter,
  resolvePaginationUrl,
  resolveProduct,
  calculateSalePrice
} from "../../../utils/functions";
import "./Pagination.css";
import "./ProdShow.css";

class UserProdGroup extends React.Component {
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
    let old_location = this.props.location.pathname;
    let new_location = nextProps.location.pathname;
    let isChanged = false;
    if(new_location != old_location) isChanged = true;
    for(let i in new_query){
      if(new_query[i] != old_query[i]){
        isChanged = true;
        break;
      }
    }
    for(let i in old_query){
      if(new_query[i] != old_query[i]){
        isChanged = true;
        break;
      }
    }
    if(isChanged) {
      this.loadData(nextProps.location, new_query.page);
      window.scrollTo(0, 0);
    };
  }

  componentDidMount = () => {
    let query = queryString.parse(this.props.location.search);
    let page = query.page;
    if(!page) page = 1;
    this.loadData(this.props.location, page);
  }

  loadData = async (location, page) => {
    try{
      appLoading(true);
      if(!page || page < 1) page = 1;
      if(location.pathname.indexOf("tim-kiem") == 1){
        let query = queryString.parse(location.search);
        let data = await getProducts(`/api/product-user?searchName=${query.search}&page=${page || 1}`);
        this.setState({
          products: data.products || [],
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        });
      }else{
        let category_path = location.pathname;
        category_path = category_path.split("_cat")[1].replace(/\./g, "/");
        let data = await getProducts(`/api/product-user?category=${category_path}&page=${page || 1}`);
        this.setState({
          products: data.products || [],
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        });
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
    let { totalPages, currentPage, products } = this.state
    let paginationItems = [];
    for(let i = 1; i <= totalPages; i++){
      paginationItems.push(
        <span
          className={i == currentPage ? "paginationItem active" : "paginationItem"}
          key={i}
        ><Link
          to={resolvePaginationUrl(this.props.location, i)}
          onClick={i == currentPage ? null : () => window.scrollTo(0, 0)}
        >{i}</Link>
        </span>
      )
    }
    return (
      <React.Fragment>
        {!products || products.length <= 0 ? (
          <div className="emptyAlert"
            style={{textAlign: "center", marginTop: "40px", color: "#00000095"}}
          >
            <p style={{marginBottom: "10px"}}>DANH MỤC ĐÃ HẾT HOẶC CHƯA CÓ SẢN PHẨM</p>
            <p>SHOP KHÔNG TÌM THẤY SẢN PHẨM NÀO PHÙ HỢP</p>
          </div>
        ) : (
          <React.Fragment>
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
                      <div className="prodReviewLink"><a href={prod_review} target="blank">xem review >></a></div>
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
            {totalPages > 1 ? (
              <div className="Pagination">
                <div className="paginationWrapper">
                  {paginationItems.map(item => {
                    return item;
                  })}
                </div>
              </div>
            ) : null}
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

export default connect(mapStateToProps)(UserProdGroup);