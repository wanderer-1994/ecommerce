const msClient = require("../mysql/mysql");

const getResGeneralVariables = (req, res, next) => {
    res.Alert = [];
    next();
}

const getReqGeneralVariables = (req, res, next) => {
    req.admin = {};
    req.user = {};
    next();
}

const checkAdminByCookie = async (req, res, next) => {
    try{
        let admin_cookie;
        try{
            let auth = JSON.parse(req.headers.authorization);
            admin_cookie = auth.admin_cookie;
        }catch(err){
            //do nothing
        }
        if(!admin_cookie || admin_cookie == "") return next();
        let sqlFindAdminByCookie = `SELECT * FROM phukiendhqg.admin WHERE admin_cookie="${admin_cookie}" LIMIT 1`;
        let admins = await msClient.promiseQuery(sqlFindAdminByCookie);
        if(admins[0] && admins[0].admin_id) req.admin = admins[0];
        next();
    } catch (err) {
        console.log(err);
        next();
    }
}



module.exports = {  
    getResGeneralVariables,
    getReqGeneralVariables,
    checkAdminByCookie,
}