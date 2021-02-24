// Validation patt
const cookie_patt = /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;
const tel_patt = /^0[35789]\d{8}$/; // Có 10 số và bắt đầu với 03, 05, 07, 08, 09
const space_patt = /\s/;
const input_text_patt = /[\\'"=<>#\*%\$\&]|-{2}/; //Không chứa các ký tự lạ
const date_patt = /^\d\d\d\d-\d\d-\d\d/;

module.exports = {
    cookie_patt,
    tel_patt,
    space_patt,
    input_text_patt,
    date_patt,
}