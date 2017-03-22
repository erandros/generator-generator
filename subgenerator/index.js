'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const superb = require('superb');
const yosay = require('yosay');
const hogan = require('hogan.js');
const extend = require('deep-extend');
const extra = require('yeoman-extra');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    extra.inject(this);
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'This is the generator for generator-generator. '
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: "What is the generator name?"
    }, {
      type: 'input',
      name: 'templateName',
      default: '',
      message: "What is the template file name?"
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  writing() {
    const generatorName = this.fs.readJSON(this.destinationPath('package.json')).name;

    this.fs.copyHogan(
      this.templatePath('index.js'),
      this.destinationPath(path.join('generators', this.props.name, 'index.js')),
      {
        // Escape apostrophes from superb to not conflict with JS strings
        superb: superb().replace('\'', '\\\''),
        generatorName,
        templateName: this.props.templateName
      }
    );

    if (this.props.templateName) {
      this.fs.copy(
        this.templatePath('templates/dummyfile.txt'),
        this.destinationPath(path.join('generators', this.props.name, 'templates/' + this.props.templateName))
      );
    }
  }
};
