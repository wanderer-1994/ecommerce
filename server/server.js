const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require("cors")
const formidable = require("formidable");
const msClient = require("./utils/mysql/mysql");

const { 
    getResGeneralVariables,
    getReqGeneralVariables,
} = require("./utils/middlewares/middlewares");

const AdminRouter = require("./routes/user/AdminRouter");
const CategoryRouter = require("./routes/user/CategoryRouter");
const OrderRouter = require("./routes/user/orderRouter/OrderRouter");
const ProductRouter = require("./routes/user/ProductRouter");
const UserRouter = require("./routes/users/UserRouter");
const Others = require("./routes/user/Others");

async function appInit () {
    // connect database
    await msClient.connectAsync();

    // app config
    const app = express();
    // app.set('trust proxy', true);
    app.use(cors());
    app.use(express.static("/APP/phukiendhqg/client/build"));
    // app.use(express.static(__dirname + "/build"));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(getReqGeneralVariables, getResGeneralVariables);

    const apiModules = [
        AdminRouter,
        CategoryRouter,
        OrderRouter,
        ProductRouter,
        UserRouter,
        Others
    ];

    app.use("/api", apiModules);

    app.get("/*", (req, res) => {
        res.sendFile("/APP/phukiendhqg/client/build/index.html");
        // res.sendFile(__dirname + "/build/index.html");
    })

    app.listen(80, () => {
        console.log("listening port: ", 80)
    })
}

appInit();
