import { Fragment } from "react";

const variant_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        style: {width: "100px"},
        render: function ({ self, entity, idx }) {
            let value = entity[self.column];
            return (
                <td className="td_input" key={idx}
                    style={self.style}
                >
                    <a href={`/product/${value}`} target="_blank">{value}</a>
                </td>
            )
        }
    },
    {
        column_name: "Name",
        style: {minWidth: "300px"},
        render: function ({ self, entity, idx }) {
            let name = (entity.attributes || []).find(item => item.attribute_id === "name") || {};
            let value = name.value;
            return (
                <td className="td_input" key={idx}
                    style={self.style}
                >
                    <input type="text" disabled value={value} />
                </td>
            )
        }
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
                                    {variant_columns.map((col_item, idx) => col_item.render({
                                        self: col_item,
                                        entity: item,
                                        idx: idx
                                    }))}
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