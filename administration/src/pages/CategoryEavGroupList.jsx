import EavGroupRender from "../components/EavGroupRender";

function CategoryEavGroupList (props) {

    return (
        <div className="category-eav-group">
            <div className="title">
                <h3>{props.title}</h3>
            </div>
            <div className="content">
                <EavGroupRender entity_type="category" />
            </div>
        </div>
    )
}

export default CategoryEavGroupList;