/**
 * @fileoverview 限制TODOs个数
 * @author bethon
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/todo-comments"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("todo-comments", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "TODO * count",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
