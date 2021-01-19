import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import store from "./redux/store";
import "./index.css";

const hist = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={hist}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Router>
    </Provider>,
    document.getElementById('root')
);
serviceWorker.unregister();
