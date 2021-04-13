import { useState, useEffect, Fragment } from "react";
import * as api from "../api/mockApi";
import "../css/detail.css";
import * as appFunction from "../utils/appFunction";
import $ from "jquery";
import EavAttributeRender from "../components/EavAttributeRender";
import * as CategoryModel from "../objectModels/CategoryModel";

const product_entity_columns = [
    {
        column: "entity_id",
        column_name: "ID",
        required: true,
        render: ({ self, state, setState }) => {
            return (
                <input disabled={true} type="text" value={state[self.column] || ""} />
            )
        }
    },
    {
        column: "type_id",
        column_name: "Product type",
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "parent",
        column_name: "Parent",
        render: ({ self, state, setState }) => {
            return (
                <input type="text" value={state[self.column] || ""} onChange={event => setState({ ...state, [self.column]: event.target.value })} />
            )
        }
    },
    {
        column: "created_at",
        column_name: "Created at",
        required: true,
        render: ({ self, state, setState }) => {
            let value = typeof(state[self.column]) === "number" ? (new Date(state[self.column])).toISOString() : null;
            return (
                <input type="datetime-local" value={value} onChange={event => {
                    let new_value = (new Date(event.target.value)).getTime();
                    setState({ ...state, [self.column]: new_value })
                }} />
            )
        }
    },
    {
        column: "updated_at",
        column_name: "Last update",
        required: true,
        render: ({ self, state, setState }) => {
            let value = typeof(state[self.column]) === "number" ? (new Date(state[self.column])).toISOString() : null;
            return (
                <input type="datetime-local" value={value} onChange={event => {
                    let new_value = (new Date(event.target.value)).getTime();
                    setState({ ...state, [self.column]: new_value })
                }} />
            )
        }
    }
];

function ProductDetail () {
    return (
        <div className="product-detail">Product detail</div>
    )
}

export default ProductDetail;