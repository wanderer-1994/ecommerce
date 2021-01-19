import React from "react";
import { connect } from "react-redux";
import { convertTimeStamp, resolveProduct, removeVnCharacter } from "../../../utils/functions";
import { appLoading } from "../../../utils/appFunction";
import "./ProductDetailEditor.css";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";

class ProductDetailEditor extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        prod: {...this.props.prod},
        ori_prod: {...this.props.ori_prod},
        largeImg: 0,
        imgLinks: this.props.prod.prod_img ? this.props.prod.prod_img.split("imgSpliter_TKH") : []
    }
  }

  changeLargeImg = index => {
      this.setState({ largeImg: index });
  }

  handleChangeImgLinks = (index, value) => {
    let { imgLinks } = this.state;
    imgLinks[index] = value;
    this.setState({ imgLinks: imgLinks });
  }

  addImgLink = () => {
      let imgLinks = this.state.imgLinks;
      imgLinks.push("");
      this.setState({ imgLinks: imgLinks })
  }

  removeImgLink = index => {
    let imgLinks = this.state.imgLinks;
    imgLinks.splice(index, 1);
    this.setState({ imgLinks: imgLinks })
  }

  handleChangeReviewLink = (value) => {
      let { prod } = this.state;
      prod.prod_review = value;
      this.setState({ prod: prod });
  }

  handleChangeProdLink = value => {
    let { prod } = this.state;
    prod.prod_link = value;
    this.setState({ prod: prod });
  }

  handleChangeProdThumb = value => {
    let { prod } = this.state;
    prod.prod_thumb = value;
    this.setState({ prod: prod });
  }

  handChangeProdDescription = value => {
    let { prod } = this.state;
    prod.prod_description = value;
    this.setState({ prod: prod });
  }

  cancelEdit = () => {
    this.props.onCancel();
  }

  submitEdit = () => {
    let { imgLinks, prod } = this.state;
    let prod_img = "";
    imgLinks.forEach(link_item => {
        if(link_item && link_item != "")
        prod_img += `${link_item}imgSpliter_TKH`;
    })
    prod_img = prod_img.replace(/imgSpliter_TKH$/, "");
    prod.prod_img = prod_img;
    this.props.onSubmit(prod)
  }

  render() {
    let { prod, ori_prod, imgLinks, largeImg } = this.state;
    return (
        <React.Fragment>
            <div className="ProductDetailEditor">
                <div className="productDetailWrapper">
                    <div className="prod_name">{prod.prod_name || prod.sup_name}</div>
                    <div className="prodDetailWrapper1">
                        <div className="imgContainer">
                            <p>prod_img</p>
                            <div className="mainImg">
                                <img src={imgLinks[largeImg]}></img>
                            </div>
                            <div className="miniImgs">
                                {imgLinks.map((item, index) => {
                                    return (
                                        <img
                                            className={index == largeImg ? "active" : null}
                                            key={index}
                                            src={item} alt=""
                                            onClick={() => this.changeLargeImg(index)}
                                        />
                                    )
                                })}
                            </div>
                            <div className="imgLinks">
                                {imgLinks.map((item, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <input
                                                value={item || ""}
                                                onChange={(event) => this.handleChangeImgLinks(index, event.target.value)}
                                            />
                                            <span
                                                className="delete"
                                                onClick={() => this.removeImgLink(index)}
                                            ><Remove/></span>
                                        </React.Fragment>
                                    )
                                })}
                                <span
                                    className="add"
                                    onClick={() => this.addImgLink()}
                                ><Add/></span>
                            </div>
                        </div>
                        <div className="review_n_des">
                            <p>prod_thumb</p>
                            <div className="thumbContainer">
                                <img src={prod.prod_thumb}></img>
                            </div>
                            <input
                                value={prod.prod_thumb || ""}
                                onChange={(event) => this.handleChangeProdThumb(event.target.value)}
                            />
                            <p>prod_review</p>
                            <input
                                value={prod.prod_review || ""}
                                onChange={(event) => this.handleChangeReviewLink(event.target.value)}
                            />
                            <p>prod_description</p>
                            <div
                                dangerouslySetInnerHTML={{__html: prod.prod_description || ""}}
                            />
                            <textarea
                                value={prod.prod_description || ""}
                                onChange={(event) => this.handChangeProdDescription(event.target.value)}
                            ></textarea>
                            <p>prod_link</p>
                            <input
                                value={prod.prod_link || ""}
                                onChange={(event) => this.handleChangeProdLink(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="action">
                        <button onClick={() => this.cancelEdit()} className="cancel">hủy</button>
                        <button onClick={() => this.submitEdit()} className="submit">ok</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
  }
}

export default ProductDetailEditor;