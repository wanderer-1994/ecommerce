import { useState, useEffect, Fragment } from "react";
import $ from "jquery";
import { eav_group_columns, eav_group_attribute_columns } from "../common/eavCommon";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AddRounded from "@material-ui/icons/AddRounded";
import ArrowRight from "@material-ui/icons/ArrowRight";
import Clear from "@material-ui/icons/Clear";
import EavAttributeSelector from "./EavAttributeSelector";
import "./EavGroupRender.css";
import * as api from "../api/mockApi";
import database_data_type from "../objectModels/database_data_type";
import utility from "../utils/utility";
import * as appFunction from "../utils/appFunction";

function EavGroupRender (props) {

    const [new_group, setNewGroup] = useState("");
    const [ori_eav_groups, setOriEavGroups] = useState([]);
    const [eav_groups, setEavGroups] = useState([]);
    const [attr_selector_gr, setAttrSelectorGr] = useState(null);

    useEffect(() => {
        api.getEavGroups(props.entity_type)
        .then(data => {
            setOriEavGroups(JSON.parse(JSON.stringify(data.eav_groups)));
            setEavGroups(JSON.parse(JSON.stringify(data.eav_groups)));
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    async function saveEavGroup (event, eav_group) {
        try {
            $(event.target).attr("disabled", true);
            $(event.target).addClass("disabled");
            let eav_group_copy = JSON.parse(JSON.stringify(eav_group));
            delete eav_group_copy.expanded;
            let ori_eav_group = ori_eav_groups.find(item => item.group_id === eav_group_copy.group_id);
            if (JSON.stringify(ori_eav_group) !== JSON.stringify(eav_group_copy)) {
                let result;
                if (!ori_eav_group) {
                    result = await api.createEavGroups(props.entity_type, [eav_group_copy]);
                } else {
                    eav_group_copy.attributes = eav_group_copy.attributes || [];
                    (ori_eav_group.attributes || []).forEach(ori_item => {
                        let copy_match = eav_group_copy.attributes.find(m_item => m_item.attribute_id === ori_item.attribute_id);
                        if (!copy_match) {
                            eav_group_copy.attributes.push({
                                attribute_id: ori_item.attribute_id,
                                action: "UNASSIGN"
                            })
                        }
                    })
                    result = await api.updateEavGroups(props.entity_type, [eav_group_copy]);
                };
                if (result.eav_groups && result.eav_groups[0] && result.eav_groups[0].isSuccess) {
                    appFunction.appAlert({
                        icon: "success",
                        title: <div>Success</div>,
                        message: (
                            <div>
                                <span>{`Successfully ${ori_eav_group ? "update" : "create"} eav_group ${eav_group_copy.group_id}!`}</span>
                            </div>
                        ),
                        timeOut: 1000,
                        onTimeOut: () => {
                            $(event.target).removeClass("disabled");
                            $(event.target).attr("disabled", false);
                        }
                    });
                    api.getEavGroups(props.entity_type)
                    .then(data => {
                        setOriEavGroups(JSON.parse(JSON.stringify(data.eav_groups)));
                        let match_api_eav_group = data.eav_groups.find(item => item.group_id === eav_group.group_id);
                        if (match_api_eav_group) {
                            eav_groups.forEach((item, index) => {
                                if (item.group_id === match_api_eav_group.group_id) {
                                    eav_groups[index] = JSON.parse(JSON.stringify(match_api_eav_group));
                                    let new_eav_groups = utility.sortArrayByAttribute({
                                        array: eav_groups,
                                        attribute_id: "sort_order",
                                        sort_rule: "ASC"
                                    });
                                    setEavGroups([...new_eav_groups]);
                                }
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            } else {
                appFunction.appAlert({
                    icon: "info",
                    title: <div>No changes detected</div>,
                    message: <div style={{whiteSpace: "pre-line"}}>Please make changes before save!</div>,
                    timeOut: 700,
                    onTimeOut: () => {
                        $(event.target).removeClass("disabled");
                        $(event.target).attr("disabled", false);
                    }
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="eav-group-render">
            {attr_selector_gr ? (
                <EavAttributeSelector
                    entity_type={props.entity_type}
                    attr_group={attr_selector_gr}
                    onClose={() => {setAttrSelectorGr(null)}}
                    onChange={(selected) => {
                        let new_attributes = selected.map(item => {
                            return {
                                attribute_id: item
                            }
                        });
                        attr_selector_gr.attributes = attr_selector_gr.attributes || [];
                        attr_selector_gr.attributes.push(...new_attributes);
                        setEavGroups([...eav_groups]);
                        setAttrSelectorGr(null);
                    }}
                />
            ) : null}
            <div className="util-menu">
                <div className="new-group-input">
                    <input type="text" value={new_group} onChange={event => setNewGroup(event.target.value)} />
                    <div className="alert_message"></div>
                </div>
                <button className="expand-all large success"
                    onClick={() => {
                        let new_group_value = new_group.trim();
                        if (new_group_value.length === 0) {
                            $(".alert_message").text("Please enter valid group name!");
                        } else if (eav_groups.find(item => item.group_id === new_group_value)) {
                            $(".alert_message").text(`group_id "${new_group_value}" already exists!`)
                        } else {
                            $(".alert_message").text("");
                            eav_groups.push({
                                group_id: new_group_value,
                                attributes: [],
                                sort_order: null
                            })
                            setNewGroup("");
                            setEavGroups([...eav_groups]);
                        }
                    }}
                >Add group</button>
                <button className="expand-all large info"
                    onClick={() => {
                        eav_groups.forEach(item => item.expanded = true);
                        setEavGroups([...eav_groups]);
                    }}
                >Expand all</button>
                <button className="collapse-all large danger"
                    onClick={() => {
                        eav_groups.forEach(item => item.expanded = false);
                        setEavGroups([...eav_groups]);
                    }}
                >Collapse all</button>
            </div>
            <table className="tb_list">
                <thead>
                    <tr>
                        <th></th>
                        <th>Group/Attribute ID</th>
                        <th>Group/Attribute Ord</th>
                    </tr>
                </thead>
                <tbody>
                    {eav_groups.map((group_item, index) => {
                        group_item.sort_order = index + 1;
                        return (
                            <Fragment key={index}>
                                <tr className="eav-group-row">
                                    <td className="expand-icon">
                                        <ExpandMore className={group_item.expanded ? "" : "collapsed"}
                                            onClick={() => {
                                                group_item.expanded = !group_item.expanded;
                                                setEavGroups([...eav_groups]);
                                            }}
                                        />
                                    </td>
                                    <td>{group_item.group_id}</td>
                                    <td className="sort-order">
                                        <input type="text" placeholder={group_item.sort_order} />
                                        <ArrowRight className="sort" onClick={(event) => {
                                            let $target = $(event.target).parent().parent().find("input");
                                            $target.trigger("blur");
                                            setTimeout(() => {
                                                let new_pos = $target.val();
                                                if (parseInt(new_pos) == new_pos && new_pos > 0) {
                                                    new_pos = parseInt(new_pos);
                                                    eav_groups.splice(index, 1);
                                                    eav_groups.splice(new_pos - 1, 0, group_item);
                                                    setEavGroups([...eav_groups]);
                                                    $target.val("");
                                                } else {
                                                    appFunction.appAlert({
                                                        icon: "warning",
                                                        title: <div>Invalid order</div>,
                                                        message: <div style={{whiteSpace: "pre-line"}}>Order must be positive int</div>,
                                                        showConfirm: true,
                                                        submitTitle: "OK"
                                                    })
                                                };
                                            }, 100);
                                        }} />
                                        <Clear className="remove" onClick={(event) => {
                                            if ($(event.target).hasClass("disabled")) return;
                                            $(event.target).addClass("disabled");
                                            appFunction.appAlert({
                                                icon: "warning",
                                                title: <div>Confirm action</div>,
                                                message: <div>Delete eav_group <span className="hightlight">{group_item.group_id}</span> ?</div>,
                                                showConfirm: true,
                                                submitTitle: "Delete",
                                                cancelTitle: "Cancel",
                                                onClickSubmit: () => {
                                                    api.deleteEavGroups(props.entity_type, [group_item.group_id])
                                                    .then(data => {
                                                        if (data.isSuccess) {
                                                            appFunction.appAlert({
                                                                icon: "success",
                                                                title: <div>Action completed</div>,
                                                                message: <div>eav_group <span className="hightlight">{group_item.group_id}</span> deleted!</div>,
                                                                timeOut: 300
                                                            });
                                                            api.getEavGroups()
                                                            .then(data => {
                                                                setOriEavGroups(JSON.parse(JSON.stringify(data.eav_groups)));
                                                                let match_api_eav_group = data.eav_groups.find(item => item.group_id === group_item.group_id);
                                                                if (match_api_eav_group) {
                                                                    eav_groups.forEach((item, index) => {
                                                                        if (item.group_id === match_api_eav_group.group_id) {
                                                                            eav_groups[index] = JSON.parse(JSON.stringify(match_api_eav_group));
                                                                            let new_eav_groups = utility.sortArrayByAttribute({
                                                                                array: eav_groups,
                                                                                attribute_id: "sort_order",
                                                                                sort_rule: "ASC"
                                                                            });
                                                                            setEavGroups([...new_eav_groups]);
                                                                        }
                                                                    })
                                                                } else {
                                                                    let new_eav_groups = eav_groups.filter(item => item.group_id !== group_item.group_id);
                                                                    setEavGroups(new_eav_groups);
                                                                }
                                                            })
                                                            .catch(err => console.log(err));
                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    })
                                                }
                                            })
                                        }} />
                                    </td>
                                </tr>
                                {(group_item.attributes || []).map((attribute, attr_idx) => {
                                    attribute.sort_order = attr_idx + 1;
                                    return (
                                        <tr key={attr_idx} className={`eav-attribute-row${group_item.expanded ? "" : " collapsed"}`}>
                                            <td>--| </td>
                                            <td>{attribute.attribute_id}</td>
                                            <td className="sort-order">
                                                <input type="text" placeholder={attribute.sort_order} onChange={event => {
                                                    if (database_data_type["POSITIVE_INT"].f_validation(event.target.value)) {
                                                        attribute.sort_order = parseInt(event.target.value);
                                                    }
                                                }} />
                                                <ArrowRight className="sort" onClick={(event) => {
                                                    let $target = $(event.target).parent().parent().find("input");
                                                    $target.trigger("blur");
                                                    setTimeout(() => {
                                                        let new_pos = $target.val();
                                                        if (parseInt(new_pos) == new_pos && new_pos > 0) {
                                                            new_pos = parseInt(new_pos);
                                                            group_item.attributes.splice(attr_idx, 1);
                                                            group_item.attributes.splice(new_pos - 1, 0, attribute);
                                                            setEavGroups([...eav_groups]);
                                                            $target.val("");
                                                        } else {
                                                            appFunction.appAlert({
                                                                icon: "warning",
                                                                title: <div>Invalid order</div>,
                                                                message: <div style={{whiteSpace: "pre-line"}}>Order must be positive int</div>,
                                                                showConfirm: true,
                                                                submitTitle: "OK"
                                                            })
                                                        };
                                                    }, 100);
                                                }} />
                                                <Clear className="remove" onClick={() => {
                                                    group_item.attributes.splice(attr_idx, 1);
                                                    setEavGroups([...eav_groups]);
                                                }} />
                                            </td>
                                        </tr>
                                    )
                                })}
                                <tr className={`eav-attribute-row action${group_item.expanded ? "" : " collapsed"}`}>
                                    <td></td>
                                    <td className="add-attribute">
                                        Add attribute&nbsp;
                                        <AddRounded onClick={() => setAttrSelectorGr(group_item)} />
                                    </td>
                                    <td>
                                        <button className="tb_button save-group"
                                            onClick={event => saveEavGroup(event, group_item)}
                                        >Save</button>
                                    </td>
                                </tr>
                            </Fragment>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default EavGroupRender;