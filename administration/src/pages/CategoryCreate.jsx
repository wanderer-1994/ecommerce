import { useEffect, useState } from "react";
import * as api from "../api/mockApi";
import * as eavUtils from "../objectModels/eavUtils";

const category_entity_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        data_type: "text",
        align: "left",
        td_style: {
            minWidth: "70px"
        },
        th_style: {
            minWidth: "70px"
        }
    },
    {
        column: "name",
        column_name: "Name",
        data_type: "text",
        align: "left",
        td_style: {
            minWidth: "100px"
        },
        th_style: {
            minWidth: "100px"
        }
    },
    {
        column: "parent",
        column_name: "Parent",
        data_type: "text",
        align: "left",
        td_style: {
            minWidth: "100px"
        },
        th_style: {
            minWidth: "100px"
        }
    },
    {
        column: "is_online",
        column_name: "Online",
        data_type: "number",
        align: "center",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        },
        f_convert_value: value => {
            if (value === 1 || value === true) return 1;
            if (value === 0 || value === false) return 0;
            return value;
        }
    },
    {
        column: "position",
        column_name: "Position",
        data_type: "number",
        align: "right",
        td_style: {
            width: "80px"
        },
        th_style: {
            width: "80px"
        }
    }
];

const default_category = {
    entity_id: "",
    name: "",
    parent: "",
    is_online: "",
    position: "",
    attributes: []
}

function CategoryCreate (props) {
    const [category, setCategory] = useState(default_category);
    const [categoryEavs, setCategoryEavs] = useState([]);
    useEffect(() => {
        api.getCategoryEavs()
        .then(category_eavs => {
            category_eavs = eavUtils.sortEavByPosition(category_eavs);
            setCategoryEavs(category_eavs || []);
        })
        .catch(err => {
            console.log(err);
        });
    }, [])
    return (
        <div className="category-create">
            <div className="title">
                <h3>{props.title}</h3>
            </div>
            <div className="content">
                <div className="category-entity">

                </div>
                <div className="category-eav">

                </div>
            </div>
        </div>
    )
}

export default CategoryCreate;