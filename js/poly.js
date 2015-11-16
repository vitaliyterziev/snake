/*
    Polyfill library
*/

var Poly = {
    //polyfill Set()
    set: function (array) {
        'use strict'
        var cleanList = [];
        var bool = false;
        
        array.forEach(function (itemDup) {
            cleanList.forEach(function (noDup) {
                if (noDup[0] === itemDup[0] && noDup[1] === itemDup[1]) {
                    bool = true;
                }
            });
            if (!bool) {
                cleanList.push(itemDup);
            }
            bool = false;
        });
        return cleanList;
    }
};
