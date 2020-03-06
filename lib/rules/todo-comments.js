/**
 * @fileoverview Rule that warns about used warning comments and shows they as are， with limit count
 * @author bethon <https://github.com/fXy-during>
 * @author bethon <https://github.com/fXy-during>
 */

'use strict';

var ellipsize = require('ellipsize');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const MAX_WARNING_COUNT = 5;
let warningCount = 0;
let hasThrowError = false;
const warningList = [];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'warn about todos',
      category: 'Best Practices',
      recommended: false
    },

    schema: [
      {
        type: 'object',
        properties: {
          terms: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          location: {
            enum: ['start', 'anywhere']
          }
        },
        additionalProperties: false
      }
    ]
  },
  // create (function) returns an object with methods that
  // ESLint calls to "visit" nodes while traversing the
  // abstract syntax tree (AST as defined by ESTree) of JavaScript code:
  create: function(context) {
    const SourceCode = context.getSourceCode();
    var configuration = context.options[0] || {},
      warningTerms = configuration.terms || ['todo', 'fixme', 'bug'],
      location = configuration.location || 'start',
      selfConfigRegEx = /\bno-warning-comments\b/,
      warningRegExps;

    const comments = SourceCode.getAllComments();
    /**
     * Convert a warning term into a RegExp which will match a comment containing that whole word in the specified
     * location ("start" or "anywhere"). If the term starts or ends with non word characters, then the match will not
     * require word boundaries on that side.
     *
     * @param {string} term A term to convert to a RegExp
     * @returns {RegExp} The term converted to a RegExp
     */
    function convertToRegExp(term) {
      var escaped = term.replace(/[-\/\\$\^*+?.()|\[\]{}]/g, '\\$&'),
        suffix,
        prefix;

      /*
       * If the term ends in a word character (a-z0-9_), ensure a word
       * boundary at the end, so that substrings do not get falsely
       * matched. eg "todo" in a string such as "mastodon".
       * If the term ends in a non-word character, then \b won't match on
       * the boundary to the next non-word character, which would likely
       * be a space. For example `/\bFIX!\b/.test('FIX! blah') === false`.
       * In these cases, use no bounding match. Same applies for the
       * prefix, handled below.
       */
      suffix = /\w$/.test(term) ? '\\b' : '';

      if (location === 'start') {
        /*
         * When matching at the start, ignore leading whitespace, and
         * there's no need to worry about word boundaries.
         */
        prefix = '^\\s*';
      } else if (/^\w/.test(term)) {
        prefix = '\\b';
      } else {
        prefix = '';
      }

      return new RegExp(prefix + escaped + suffix, 'i');
    }

    /**
     * Checks the specified comment for matches of the configured warning terms and returns the matches.
     * @param {string} comment The comment which is checked.
     * @returns {Array} All matched warning terms for this comment.
     */
    function commentContainsWarningTerm(comment) {
      var matches = [];

      warningRegExps.forEach(function(regex, index) {
        if (regex.test(comment)) {
          matches.push(warningTerms[index]);
        }
      });

      return matches;
    }

    function checkWarningCount() {
      return warningCount >= MAX_WARNING_COUNT;
    }

    /**
     * Checks the specified node for matching warning comments and reports them.
     * @param {ASTNode} node The AST node being checked.
     * @returns {void} undefined.
     */
    function checkComment(comment) {
      var matches = commentContainsWarningTerm(comment.value);
      matches.forEach(function(matchedTerm) {
        warningCount++;
        warningList.push(comment);
      });
    }

    /**
     * 统计TODO个数
     * 超过一定限制，就抛出错误
     *
     */
    function entry() {
      if (checkWarningCount() && !hasThrowError) {
        warningList.forEach(comment => {
          context.report(comment, ellipsize(comment.value.trim(), 60));
        });

        context.report(
          warningList[warningList.length - 1],
          `TODO个数多余${MAX_WARNING_COUNT}个，请及时处理`
        );
        hasThrowError = true;
      }
    }

    warningRegExps = warningTerms.map(convertToRegExp);
    comments && comments.forEach(checkComment);
    entry();

    return {};
  }
};
