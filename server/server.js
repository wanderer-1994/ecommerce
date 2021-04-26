const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require("cors");
const formidable = require("formidable");
const msClient = require("./system_modules/mysql/mysql");
const utility = require("./system_modules/functions");

const { 
    getResGeneralVariables,
    getReqGeneralVariables,
} = require("./system_modules/middlewares/middlewares");

// const AdminRouter = require("./routes/user/AdminRouter");
const userCategoryRouter = require("./routes/user/CategoryRouter");
const adminCategoryRouter = require("./routes/admin/CategoryRouter");
const userProductRouter = require("./routes/user/ProductRouter");
const adminProductRouter = require("./routes/admin/ProductRouter");
// const OrderRouter = require("./routes/user/orderRouter/OrderRouter");
// const UserRouter = require("./routes/users/UserRouter");
// const Others = require("./routes/user/Others");
const env_files = {
    "development"   : ".env.development",
    "production"    : ".env.production",
    "test"          : ".env.test",
    "default"       : ".env.development",
}

async function appInit () {
    // init app environment
    let env = utility.getCmdArgument("--env");
    let config_file = env_files[env] || env_files.default;
    require("dotenv").config({path: `./env_config/${config_file}`});

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

    const userApiModules = [
        // AdminRouter,
        userCategoryRouter,
        // OrderRouter,
        userProductRouter,
        // UserRouter,
        // Others
    ];

    const adminApiModules = [
        adminCategoryRouter,
        adminProductRouter
    ]

    app.use("/api", userApiModules);

    app.use("/api/admin", adminApiModules)

    // app.get("/*", (req, res) => {
    //     res.sendFile("/APP/phukiendhqg/client/build/index.html");
    //     // res.sendFile(__dirname + "/build/index.html");
    // })

    app.listen(process.env.PORT, () => {
        console.log("listening port: ", process.env.PORT)
    })
}

appInit();
