import { Fragment, useEffect, useState } from "react";
import * as api from "../../api/mockApi";

function CategoryAssignment ({ productEntity, setProductEntity }) {

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

    function renderOptionValue (category, level) {
        return (
            <Fragment>
                <option style={{paddingLeft: `${level * 10}px`}} value={category.entity_id}>
                    {level > 0 ? "l_" : ""}{category.name}
                </option>
                {(category.children || []).map(item => {
                    return renderOptionValue(item, level + 1);
                })}
            </Fragment>
        )
    }

    return (
        <Fragment>
            {!isLoaded ? (
                <div>Loading</div>
            ) : (
                <div>
                    <select multiple value={(productEntity.categories || []).map(item => item.category_id)}>
                        <option value="">------</option>
                        {(categories.structured || []).map(item => {
                            let level = 0;
                            return renderOptionValue(item, level);
                        })}
                    </select>
                </div>
            )}
        </Fragment>
    )
}

export default CategoryAssignment;