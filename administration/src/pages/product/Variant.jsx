import { Fragment } from "react";

const variant_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        style: {width: "100px"}
    },
    {
        getData: function (entity) {
            let name = (entity.attributes || []).find(item => item.attribute_id === "name") || {};
            return name.value;
        },
        column_name: "Name",
        style: {minWidth: "300px"}
    }
]

function Variant ({ ori_product }) {
    let variants = ori_product.variants || [];
    return (
        <div className="product-section-variant">
            {variants.length > 0 ? (
                <table className="tb_list">
                    <thead>
                        <tr>
                            <th>ORD</th>
                            {variant_columns.map((col_item, index) => {
                                return <th key={index} style={col_item.th_style}>{col_item.column_name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {variants.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="td_input null"
                                        style={{textAlign: "right", padding: "0px 5px 0px 5px"}}
                                    >{index + 1}</td>
                                    {variant_columns.map((col_item, idx) => {
                                        let value = col_item.column ? item[col_item.column] : col_item.getData(item);
                                        return (
                                            <td className="td_input" key={idx}
                                                style={col_item.style}
                                            >
                                                <input type="text" disabled value={value} />
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            ) : (
                <Fragment>
                    This product doesn't have any variation
                </Fragment>
            )}
        </div>
    )
}

export default Variant;