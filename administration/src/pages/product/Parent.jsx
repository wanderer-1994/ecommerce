import { useState } from "react";
import utility from "../../utils/utility";
import * as api from "../../api/mockApi";

function Parent ({ productEntity, setProductEntity }) {

    let [options, setOptions] = useState([]);
    let [isLoaded, setIsLoaded] = useState(0);

    function loadOptions () {
        if (!isLoaded) {
            api.getProductEntityOnly({
                type_ids: ["master"],
                psize: "infinite"
            }).then(data => {
                setOptions(data.products || []);
                setIsLoaded(1);
            }).catch(err => {
                console.log(err);
            })
        }
    }

    return (
        <div className="product-section-parent">
            <span className="input_tag left">
                <input disabled type="text" value="Parent" />
            </span>
            <span className="input_value center">
                <select value={utility.isValueEmpty(productEntity.parent) ? "" : productEntity.parent}
                    onClick={loadOptions}
                    onChange={(event) => {
                        setProductEntity({...productEntity, parent: event.target.value})
                    }}
                >
                    <option value="">-----</option>
                    {!utility.isValueEmpty(productEntity.parent) && !options.find(item => item.entity_id === productEntity.parent) ?  (
                        <option value={productEntity.parent}>{productEntity.parent}</option>
                    ) : null}
                    {options.map((item, index) => {
                        return (
                            <option key={index} value={item.entity_id}>
                                {item.entity_id} {utility.isValueEmpty(item.name) ? "" : `(${item.name})`}
                            </option>
                        )
                    })}
                </select>
            </span>
        </div>
    )
}

export default Parent;