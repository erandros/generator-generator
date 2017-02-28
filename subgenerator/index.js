'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const superb = require('superb');
const yosay = require('yosay');
const hogan = require('hogan.js');
const extend = require('deep-extend');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      type: String,
      required: true,
      description: 'Generator name'
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'This is the generator for viper-generator. '
    ));

    var prompts = [{
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

    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath(path.join('generators', this.options.name, 'index.js')),
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
        this.destinationPath(path.join('generators', this.options.name, 'templates/' + this.props.templateName))
      );
    }

    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath('test/' + this.options.name + '.js'),
      {
        name: this.options.name,
        generatorName
      }
    );
  }
};
