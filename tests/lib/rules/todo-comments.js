/**
 * @fileoverview 限制TODOs个数
 * @author bethon
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/todo-comments'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('todo-comments', rule, {
  valid: ['// TODO: todo 1'],

  invalid: [
    {
      code: `
        // TODO: todo 6 
        // TODO: todo 6 
        // TODO: todo 6 
        // TODO: todo 6 
        // TODO: todo 6
        // TODO: todo 6
      `,
      errors: [
        {
          message: 'TODO个数多余5个，请及时处理',
          type: 'Line'
        }
      ]
    }
  ]
});
