import "./Pagination.css";

const default_psize_options = [10, 15, 20, 30, 40, 100];

function Pagination ({ totalPages, currentPage, psize, totalFound, onChange }) {

    function handleChange (config) {
        if (onChange) return onChange(config);
    }

    function renderItems () {
        let items = [];
        for(let i = 0; i < totalPages; i++) {
            let active = "";
            if (i + 1 === currentPage) active = "active";
            items.push(
                <button key={i} disabled={active ? true : false} className={`pagination-item ${active}`}
                    onClick={() => handleChange({page: i + 1})}
                >{i + 1}</button>
            )
        };
        return items;
    }

    let psize_options = [...default_psize_options];

    if (typeof(psize === "number") && default_psize_options.indexOf(psize) === -1) {
        psize_options.push(psize);
        psize_options.sort((a, b) => a - b);
    }

    return (
        <div className="pagination">
            <div className="wrapper">
                {renderItems()}
                <select className="pagination-item psize" value={psize || 10} onChange={(event) => handleChange({psize: parseInt(event.target.value)})}>
                    {psize_options.map((item, index) => (
                        <option key={index} value={item}>{item} / page</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Pagination;