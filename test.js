"use strict";

class TestCls {
    constructor(tt) {
        this._test = tt;
    }

    get test() {
        return this._test;
    }

    set test(v) {
        this._test = v;
    }
}

let ff = require("./eventbus");

ff.test("hello world");