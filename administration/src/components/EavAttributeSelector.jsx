import { useState, useEffect, Fragment } from "react";
import * as api from "../api/mockApi";
import "./EavAttributeSelector.css";

function EavAttributeSelector ({ entity_type, attr_group, onClose, onChange }) {

    const [eavs, setEavs] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search_phrase, setSearchPhrase] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData () {
        try {
            let data = [];
            if (entity_type === "category") {
                data = await api.getCategoryEavs()
            } else if(entity_type === "product") {
                data = await api.getProductEavs();
            };
            data = data.filter(eav_item => {
                let isExisted = (attr_group.attributes || []).find(ex_item => ex_item.attribute_id === eav_item.attribute_id);
                if (isExisted) return false;
                return true;
            })
            setEavs(data);
        } catch (err) {
            console.log(err);
        }
    }

    let filtered_eavs = eavs.filter(item => {
        if (!search_phrase) return true;
        let search_lowercase = search_phrase.toLowerCase();
        if (
            (item.attribute_id || "").toLowerCase().indexOf(search_lowercase) !== -1 ||
            (item.label || "").toLowerCase().indexOf(search_lowercase) !== -1
        ) {
            return true;
        };
        return false;
    })

    return (
        <div className="modal-bgr eav-attribute-selector">
            <div className="modal-cover">
                <div className="modal-header">Add attributes to group: <span className="hightlight">{attr_group.group_id}</span></div>
                <div className="modal-content">
                    <div className="header">
                        <div className="search">
                            <input type="text" value={search_phrase} onChange={(event) => {
                                setSearchPhrase(event.target.value);
                            }} />
                        </div>
                    </div>
                    {filtered_eavs.map((item, index) => {
                        let isSelected = selected.indexOf(item.attribute_id) !== -1;
                        return (
                            <div key={index} className="eav-item">
                                <input type="checkbox" checked={isSelected}
                                    onChange={event => {
                                        if (event.target.checked && !isSelected) {
                                            selected.push(item.attribute_id);
                                            setSelected([...selected]);
                                        };
                                        if (!event.target.checked && isSelected) {
                                            let new_selected = selected.filter(f_item => f_item !== item.attribute_id);
                                            setSelected(new_selected);
                                        }
                                    }}
                                />
                                <span className="eav-item-name">{`${item.label} (${item.attribute_id})`}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="modal-footer">
                    <button className="modal-button cancel"
                        onClick={onClose}
                    >Cancel</button>
                    <button className="modal-button submit"
                        onClick={() => onChange(selected)}
                    >Submit</button>
                </div>
            </div>
        </div>
    )
}

export default EavAttributeSelector;