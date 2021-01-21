const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require("cors")
const formidable = require("formidable");

const { 
    getResGeneralVariables,
    getReqGeneralVariables,
} = require("./utils/middlewares/middlewares");

const AdminRouter = require("./routes/AdminRouter");
const CategoryRouter = require("./routes/CategoryRouter");
const OrderRouter = require("./routes/OrderRouter");
const ProductRouter = require("./routes/ProductRouter");
const UserRouter = require("./routes/UserRouter");
const Others = require("./routes/Others");

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
