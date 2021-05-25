const msClient = require("../../system_modules/mysql/mysql");
const mysqlutils = require("../../system_modules/mysql/mysqlutils");
const eavCommon = require("../common/eav/eavCommon");
const entity_types = eavCommon.all_entity_types;
const eav_group_columns = eavCommon.eav_group_columns;
const eav_group_assignment_columns = eavCommon.eav_group_assignment_columns;

async function getEavGroups (entity_type) {
    try {
        if (entity_types.indexOf(entity_type) === -1) {
            throw new Error("Could not get eavGroups while entity_type is invalid!")
        };
        let sql = `
        SELECT \`eg\`.group_id, \`eg\`.sort_order, \`ega\`.attribute_id, \`ega\`.sort_order AS \`attribute_sort_order\`
        FROM \`ecommerce\`.eav_group AS \`eg\`
        LEFT JOIN \`ecommerce\`.eav_group_assignment AS \`ega\`
        ON \`ega\`.group_id=\`eg\`.group_id AND \`ega\`.entity_type=\`eg\`.entity_type
        WHERE \`eg\`.entity_type="${mysqlutils.escapeQuotes(entity_type)}";
        `;
        let rawData = await msClient.promiseQuery(sql);
        let eav_groups = mysqlutils.groupByAttribute({
            rawData: rawData,
            groupBy: "group_id"
        });
        eav_groups.forEach(group => {
            group.sort_order = group.__items && group.__items[0] ? group.__items[0].sort_order : null;
            group.attributes = group.__items;
            delete group.__items;
            group.attributes.forEach(attribute => {
                attribute.sort_order = attribute.attribute_sort_order;
                ["group_id", "attribute_sort_order"].forEach(key => {
                    delete attribute[key];
                });
            });
        })
        return eav_groups;
    } catch (err) {
        throw err;
    }
}

async function saveEavGroup (entity_type, eav_group, option) {
    try {
        if (entity_types.indexOf(entity_type) === -1) {
            throw new Error("Could not saveEavGroups while entity_type is invalid!")
        }
        let validation = validateEavGroupModel(eav_group);
        if (validation.m_warning) {
            eav_group.m_warning = `WARNING: \n\t ${validation.m_warning}`;
        }
        if (!validation.isValid) {
            throw new Error( `ERROR: \n\t ${validation.m_failure}`);
        };

        // check if eav_group exist for case update
        if (option.mode === "UPDATE") {
            let sql_find_eav_group = `SELECT * FROM \`ecommerce\`.eav_group WHERE group_id="${mysqlutils.escapeQuotes(eav_group.group_id)}" AND entity_type="${mysqlutils.escapeQuotes(entity_type)}";`;
            let existing = await msClient.promiseQuery(sql_find_eav_group);
            if (!existing || !existing[0]) throw new Error(`ERROR: eav_group of entity_type ${entity_type} with group_id '${eav_group.group_id}' not exist`);
        };

        let sql_eav_group = [];
        eav_group_columns.forEach(col_item => {
            if (col_item.column === "entity_type") {
                sql_eav_group.push(col_item);
                return;
            }
            let isNotNull;
            if (option.mode === "UPDATE") {
                isNotNull = col_item.column in eav_group;
            } else if(option.mode === "CREATE") {
                isNotNull = !mysqlutils.isValueEmpty(eav_group[col_item.column]);
            };
            if (isNotNull) {
                sql_eav_group.push(col_item);
            }
        });
        if (sql_eav_group.length > 0) {
            if (option.mode === "CREATE") {
                sql_eav_group =
                `
                INSERT INTO \`ecommerce\`.eav_group (${sql_eav_group.map(col_item => col_item.column).join(", ")})
                VALUES (${sql_eav_group.map(col_item => {
                    if (col_item.column === "entity_type") {
                        return `"${mysqlutils.escapeQuotes(entity_type)}"`;
                    } else if (mysqlutils.isValueEmpty(eav_group[col_item.column])) {
                        return "NULL";
                    } else {
                        return `"${mysqlutils.escapeQuotes(eav_group[col_item.column])}"`;
                    }
                }).join(", ")});
                `;
            } else if (option.mode === "UPDATE") {
                if (sql_eav_group.length <= 1) {
                    sql_eav_group = null;
                } else {
                    sql_eav_group =
                    `
                    UPDATE \`ecommerce\`.eav_group SET ${sql_eav_group.map(col_item => {
                        if (["group_id", "entity_type"].indexOf(col_item.column) !== -1) return null;
                        return `${col_item.column} = ${
                            mysqlutils.isValueEmpty(eav_group[col_item.column]) ?
                            "NULL" :
                            `"${mysqlutils.escapeQuotes(eav_group[col_item.column])}"`}`
                    }).filter(item => item !== null).join(", ")}
                    WHERE group_id="${mysqlutils.escapeQuotes(eav_group.group_id)}" AND entity_type="${mysqlutils.escapeQuotes(entity_type)}";
                    `
                }
            }
        } else {
            sql_eav_group = null;
        };
        
        let sql_eav_group_assignment = "";
        switch (option.mode) {
            default:
                if (!eav_group.attributes || eav_group.attributes.length === 0) break;
                eav_group.attributes.forEach(attribute => {
                    if (!("action" in attribute) || attribute.action === "ASSIGN") {
                        sql_eav_group_assignment +=
                        `
                        INSERT INTO \`ecommerce\`.eav_group_assignment (${eav_group_assignment_columns.map(col_item => col_item.column).join(", ")})
                        VALUES 
                        (${eav_group_assignment_columns.map(col_item => {
                            if (col_item.column === "entity_type") return `"${mysqlutils.escapeQuotes(entity_type)}"`;
                            if (col_item.column === "group_id") return `"${mysqlutils.escapeQuotes(eav_group.group_id)}"`;
                            if (mysqlutils.isValueEmpty(attribute[col_item.column])) return "NULL";
                            return `"${mysqlutils.escapeQuotes(attribute[col_item.column])}"`;
                        })})
                        AS new
                        ON DUPLICATE KEY UPDATE 
                        ${eav_group_assignment_columns.map(col_item => `${col_item.column} = new.${col_item.column}`).join(",\n")};
                        `;
                    } else if (attribute.action === "UNASSIGN") {
                        sql_eav_group_assignment += 
                        `DELETE FROM \`ecommerce\`.eav_group_assignment WHERE entity_type="${mysqlutils.escapeQuotes(entity_type)}"
                        AND group_id="${mysqlutils.escapeQuotes(eav_group.group_id)}" AND attribute_id="${mysqlutils.escapeQuotes(attribute.attribute_id)}";`;
                    }
                });
                break;
        };


        let assembled_sql = [sql_eav_group, sql_eav_group_assignment].filter(item => item !== null && item !== "" && item !== undefined);
        if (assembled_sql.length > 0) {
            assembled_sql =
            `
            START TRANSACTION;
            ${assembled_sql.join("\n")}
            COMMIT;
            `;
            assembled_sql = assembled_sql.replace(/\n+(\s|\t)+/g, "\n").replace(/;\n/g, ";\n\n");
            let result = await msClient.promiseQuery(assembled_sql);
            return result;
        };
        return null;
    } catch (err) {
        throw err;
    }
};

async function deleteEavGroups (entity_type, eav_group_ids, option) {
    try {
        // validate input
        let isValid = true;
        let group_id_column = eav_group_columns.find(col_item => col_item.column === "group_id");
        eav_group_ids.forEach(group_id => {
            if (!group_id_column.validation_function(group_id)) {
                isValid = false;
            }
        });
        if (!isValid) throw new Error("ERROR: eav 'group_id' must be non-empty string.");
        let tbs_to_delete = [
            {
                tb_name: "eav_group",
                entity_column: "group_id",
                extra: `AND entity_type="${mysqlutils.escapeQuotes(entity_type)}"`
            },
            {
                tb_name: "eav_group_assignment",
                entity_column: "group_id",
                extra: `AND entity_type="${mysqlutils.escapeQuotes(entity_type)}"`
            }
        ];
        let sql_delete_eav_group =
        `
        START TRANSACTION;
        ${tbs_to_delete.map(table => {
            return `DELETE FROM \`ecommerce\`.${table.tb_name} WHERE \`${table.entity_column}\` IN (${eav_group_ids.map(item => `"${mysqlutils.escapeQuotes(item)}"`).join(", ")})${table.extra ? ` ${table.extra}` : ""};`
        }).join("\n")}
        COMMIT;
        `
        let result = await msClient.promiseQuery(sql_delete_eav_group);
        return result;
    } catch (err) {
        throw err;
    }
};

function validateEavGroupModel (eav_group) {
    let isValid = true;
    let m_failure = "";
    eav_group_columns.forEach(col_item => {
        if (col_item.column === "entity_type") return;
        if (!mysqlutils.isValueEmpty(eav_group[col_item.column])) {
            if (!col_item.validation_function(eav_group[col_item.column])) {
                isValid = false;
                m_failure += `\n\t ${col_item.valueInvalidMessage}`
            }
        }
    });
    switch (eav_group.attributes) {
        default:
            if (mysqlutils.isValueEmpty(eav_group.attributes)) break;
            if (!Array.isArray(eav_group.attributes)) {
                isValid = false;
                m_failure += `\n\t "attributes" must be an array or left empty!`;
                break;
            };
            eav_group.attributes.forEach(attribute => {
                if (mysqlutils.isValueEmpty(attribute)) {
                    isValid = false;
                    m_failure += `\n\t invalid attribute assignment!`;
                    return;
                }
                eav_group_assignment_columns.forEach(col_item => {
                    if (!mysqlutils.isValueEmpty(attribute[col_item.column])) {
                        if (!col_item.validation_function(attribute[col_item.column])) {
                            isValid = false;
                            m_failure += `\n\t ${col_item.valueInvalidMessage}`;
                            return;
                        }
                    };
                });
                if (mysqlutils.isValueEmpty(attribute.attribute_id)) {
                    isValid = false;
                    m_failure += `\n\t "attribute_id" assignment must not be empty!`;
                };
                if ("action" in attribute && ["ASSIGN", "UNASSIGN"].indexOf(attribute.action) === -1) {
                    isValid = false;
                    m_failure += `\n\t action" assignment must not be enum ASSIGN|UNASSIGN!`;
                }
            });
            break;
    };
    if (mysqlutils.isValueEmpty(eav_group.group_id)) {
        isValid = false;
        m_failure += `\n\t "group_id" must not be empty!`
    }
    return {
        isValid: isValid,
        m_failure: m_failure
    }
}

module.exports = {
    getEavGroups,
    saveEavGroup,
    deleteEavGroups
}