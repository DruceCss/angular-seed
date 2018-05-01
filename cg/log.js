'use strict';

let clc = require('cli-color');

module.exports = {
    c_error: clc.red.bold,
    c_warn : clc.yellow,
    c_notice : clc.blue,
    c_success: clc.green,

    log : function (text) {
        console.log(text);
    },
    warn : function (text) {
        console.log(this.c_warn(text));
    },
    error : function (text) {
        console.log(this.c_error(text));
    },
    success : function (text) {
        console.log(this.c_success(text));
    }
};