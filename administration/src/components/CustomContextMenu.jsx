import "./CustomContextMenu.css";

function ContextMenu (props) {
    const { items, position } = { ...props };
    return (
        <div className="custom-context-menu"
             style={{left: `${position.left}px`, top: `${position.top}px`}}
        >
            {items.map((item, index) => {
                return (
                    <div className="context-menu-item" key={index} onClick={item.onClick}>{item.content}</div>
                )
            })}
        </div>
    )
}

export default ContextMenu;