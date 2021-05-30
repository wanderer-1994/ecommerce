import EavGroupRender from "../components/EavGroupRender";

function ProductEavGroupList (props) {

    return (
        <div className="product-eav-group">
            <div className="title">
                <h3>{props.title}</h3>
            </div>
            <div className="content">
                <EavGroupRender entity_type="product" />
            </div>
        </div>
    )
}

export default ProductEavGroupList;