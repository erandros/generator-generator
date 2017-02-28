'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var string = require('string');
var extend = require('deep-extend');
var hogan = require('hogan.js');
var extend = require('deep-extend');

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function uncap(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

module.exports = Generator.extend({
  constructor: function(args, opts) {
    Generator.apply(this, arguments);
  },
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the {{ superb }} ' + chalk.red('{{ generatorName }}') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What\'s the name?',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },
  writing: function () {

    //Override with hogan
    this.fs.copyTpl = function (from, to, context, tplSettings, options) {
      context = context || {};

      this.copy(from, to, extend(options || {}, {
        process: function (contents, filename) {
          return hogan.compile(contents.toString())
            .render(context);
          /*
          return ejs.render(
            contents.toString(),
            context,
            // Setting filename by default allow including partials.
            extend({filename: filename}, tplSettings || {})
          );
          */
        }
      }));
    };
    // End of hogan override
    
    var obj = {

    };
    this.fs.copyTpl(
      this.templatePath('{{ templateName }}'),
      this.destinationPath('{{ templateName }}'),
      obj
    );
  }
});
