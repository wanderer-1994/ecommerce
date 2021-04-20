import { Fragment, useEffect, useState } from "react";
import * as api from "../../api/mockApi";
import * as ProductModel from "../../objectModels/ProductModel";

function CategoryAssignment ({ productEntity, setProductEntity, ori_product }) {

    const [categories, setCategories] = useState({});
    const [isLoaded, setIsLoaded] = useState(0);

    useEffect(() => {
        api.getCategories().then(data => {
            setCategories(data);
            setIsLoaded(1);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    function renderOptionValue (category, level, index) {
        return (
            <Fragment key={index}>
                <option value={category.entity_id}
                    style={{paddingLeft: `${level === 0 ? 5 : level * 10}px`, paddingRight: "10px"}}
                >
                    {level > 0 ? "l_" : ""}{category.name}
                </option>
                {(category.children || []).map((item, index) => {
                    return renderOptionValue(item, level + 1, index);
                })}
            </Fragment>
        )
    }

    return (
        <div className="product-section-category">
            {!isLoaded ? (
                <Fragment>Loading</Fragment>
            ) : (
                <Fragment>
                    <select multiple style={{height: `${(categories.categories || []).length*17 + 17}px`}}
                        value={(productEntity.categories || []).map(item => item.category_id)}
                        onChange={event => {
                            let selected = Array.from(event.target.selectedOptions, option => option.value);
                            let ori_entity = ProductModel.extractProductEntity({
                                product: ori_product,
                                entity_id: productEntity.entity_id
                            });
                            productEntity.categories = [];
                            let ori_categories = ori_entity.categories || [];
                            ori_categories.forEach(category => {
                                if (selected.indexOf(category.category_id) !== -1) {
                                    productEntity.categories.push(JSON.parse(JSON.stringify(category)));
                                    selected = selected.filter(item => item !== category.category_id);
                                }
                            });
                            selected.forEach(category_id => {
                                productEntity.categories.push({
                                    category_id: category_id
                                })
                            })
                            setProductEntity({...productEntity});
                        }}
                    >
                        <option style={{paddingLeft: "5px", paddingRight: "10px"}} value="">------</option>
                        {(categories.structured || []).map((item, index) => {
                            let level = 0;
                            return renderOptionValue(item, level, index);
                        })}
                    </select>
                </Fragment>
            )}
        </div>
    )
}

export default CategoryAssignment;