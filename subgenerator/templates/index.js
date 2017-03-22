'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var string = require('string');
var extend = require('deep-extend');
var dashify = require('dashify');
var extra = require('yeoman-extra');

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function uncap(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

module.exports = Generator.extend({
  constructor: function(args, opts) {
    Generator.apply(this, arguments);
    extra.inject(this);
  },
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the {{ superb }} ' + chalk.red('{{ generatorName }}') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What\'s the name?'
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },
  writing: function () {

    var obj = {
      name: name
    };
    this.fs.copyHandlebars(
      this.templatePath('{{ templateName }}'),
      this.destinationPath(require('path').join('{{ templateName }}')),
      obj
    );
  }
});
