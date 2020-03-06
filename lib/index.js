/**
 * @fileoverview 显示并限制你的TODO
 * @author bethon
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var todoComment = require('./rules/todo-comments');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports = {
  rules: {
    'todo-count-limit': todoComment
  }
};
