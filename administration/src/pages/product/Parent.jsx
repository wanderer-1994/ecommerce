function Parent ({ productEntity, setProductEntity }) {
    return (
        <div>{productEntity.parent || "-----"}</div>
    )
}

export default Parent;