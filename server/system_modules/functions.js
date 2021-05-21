const createSystemErrMessage = ERRCODE => {
    return "<h3>LỖI HỆ THỐNG --- ERRCODE_" + ERRCODE + "</h3>"
}

function removeVnCharacter(str){
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

function generateZerofillId ({ absolute_id, zerofil_length }) {
    let absolute_length = absolute_id.toString().length;
    if (absolute_length > zerofil_length) return new Error("ERROR: absolute_id is too large!")
    let id = "";
    for (let i = 0; i < zerofil_length - absolute_length; i++) {
        id += "0";
    }
    id += absolute_id;
    return id;
}

function getCmdArgument (arg_name) {
    let value =  null;
    process.argv.forEach(arg => {
        if (arg.indexOf("=") > 0) {
            let key = arg.slice(0, arg.indexOf("="));
            if (key === arg_name) {
                let new_value = arg.slice(arg.indexOf("=") + 1);
                if (new_value !== "") value = new_value;
            }
        }        
    });
    return value;
}

module.exports = {
    createSystemErrMessage,
    removeVnCharacter,
    generateZerofillId,
    getCmdArgument
}