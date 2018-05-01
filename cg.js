'use strict';

let Create = require('./cg/create');

let nodePath = process.argv[0];
let appPath = process.argv[1];
let action = process.argv[2]; // Тип операции create / delete

switch (action) {
    case 'create' :

        Create();
    break;

    default:

    break;
}