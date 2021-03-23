import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/mockApi";

const category_entity_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        data_type: "text",
        align: "left"
    },
    {
        column: "name",
        column_name: "Name",
        data_type: "text",
        align: "left"
    },
    {
        column: "parent",
        column_name: "Parent",
        data_type: "text",
        align: "left"
    },
    {
        column: "is_online",
        column_name: "Online",
        data_type: "int",
        align: "center"
    },
    {
        column: "position",
        column_name: "Position",
        data_type: "int",
        align: "right"
    }
]

function CategoryList (props) {
    const [category_list, setCategoryList] = useState({});
    useEffect(() => {
        api.getCategories()
        .then(data => {
            setCategoryList(data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);
    return (
        <div className="category-list">
            <div className="title">
                <h3>{props.title}</h3>
                <Link className="add-new" to="/create/category">New Category</Link>
            </div>
            <div className="content">
                <table>
                    <tr>
                        {category_entity_columns.map((col_item, index) => {
                            return <th key={index}>{col_item.column_name}</th>
                        })}
                    </tr>
                    <tbody>
                        {category_list && category_list.structured ? 
                            category_list.structured.map((cat_item, index) => {
                                let level = 0;
                                if (cat_item){
                                    return renderCategory({ cat_item, index, level });
                                } else {
                                    return null;
                                }
                            })
                        : null}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

function renderCategory ({cat_item, index, level}) {
    return (
        <Fragment>
            <tr className="category-item" key={index} style={{"--level": level}}>
                {category_entity_columns.map((col_item, index) => {
                    let value = cat_item[col_item.column];
                    if (value === null || value === undefined) {
                        value = <input type={col_item.data_type} style={{fontStyle: "italic"}} value="null" />;
                    } else {
                        value = <input type={col_item.data_type} value={value} />;
                    }
                    return <td className={`td_input readOnly ${col_item.align}`} key={index}>{value}</td>
                })}
            </tr>
            {cat_item.children ?
                cat_item.children.map((child_item, index) => {
                    if (child_item) {
                        return renderCategory({
                            cat_item: child_item,
                            index: index,
                            level: level + 1
                        });
                    } else {
                        return null
                    }
                })
            : null}
        </Fragment>
    )
}

export default CategoryList;