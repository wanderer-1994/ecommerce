import React from "react";
import "./ProductAdd.css";

class ProductAdd extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        prod_link: "",
        category: "",
        categories: this.props.categories
    }
  }

  handleChange = event => {
      let cur_state = this.state;
      cur_state[event.target.name] = event.target.value;
      this.setState(cur_state);
  }

  cancelAdd = () => {
    this.props.onCancel();
  }

  submitAdd = () => {
    this.props.onSubmit({
        prod_link: this.state.prod_link,
        category: this.state.category
    });
  }

  render() {
    let { categories, prod_link, category } = this.state;
    return (
        <React.Fragment>
            <div className="AddProduct">
                <div className="addProductWrapper">
                    <div className="title">thêm sản phẩm</div>
                    <div className="content">
                        <span>prod_link: link sản phẩm</span>
                        <input
                            value={prod_link || ""}
                            name="prod_link"
                            onChange={(event) => this.handleChange(event)}
                        />
                        <span>category: phân loại danh mục</span>
                        <select
                            value={category || "---"}
                            name="category"
                            onChange={(event) => this.handleChange(event)}
                        >   <option value="">---</option>
                            {categories.map((cat_item, index) => {
                                return (
                                    <option key={index} value={cat_item.category_path}>{cat_item.category_name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="action">
                        <button onClick={() => this.cancelAdd()} className="cancel">hủy</button>
                        <button onClick={() => this.submitAdd()} className="submit">ok</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
  }
}

export default ProductAdd;