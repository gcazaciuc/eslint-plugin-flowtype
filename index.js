var recast = require('recast');
var types = recast.types;

var currentInfos = null;

function remove(path) {
  path.replace();
  return false;
}

function transformClass(path) {
  path.get('typeParameters').replace();
  path.get('superTypeParameters').replace();
  path.get('implements').replace();
  this.traverse(path);
}

function transformPattern(path) {
  path.get('typeAnnotation').replace();
  this.traverse(path);
}


/**
 * Compile the given Flow typed JavaScript source into JavaScript usable in
 * today's runtime environments.
 *
 * @param {string} source
 * @param {object} options
 * @return {{code:string, map:string}}
 */
function compile(source, options) {
  if (!options) { options = {}; }
  var ast = recast.parse(source, {
    esprima: require('esprima-fb'),
    sourceFileName: options.souceFileName
  });
  ast = transform(ast, options);
  return recast.print(ast, {
    "sourceMapName": options.sourceMapName
  });
}

/**
 * Transform the given typed JavaScript AST into a JavaScript AST
 * usable in today's runtime environments.
 *
 * @param {object} ast
 * @return {object}
 */
function transform(ast) {

  types.visit(ast, {
    visitIdentifier: function(path) {
      path.get('optional').replace();
      path.get('typeAnnotation').replace();
      return false;
    },
    visitFunction: function(path) {
      path.get('returnType').replace();
      path.get('typeParameters').replace();
      this.traverse(path);
    },
    visitClassDeclaration: transformClass,
    visitClassExpression: transformClass,
    visitArrayPattern: transformPattern,
    visitObjectPattern: transformPattern,
    visitTypeAnnotation: remove,
    visitClassImplements: remove,
    visitClassProperty: remove,
    visitInterfaceDeclaration: remove,
    visitTypeAlias: remove,
    visitDeclareVariable: remove,
    visitDeclareFunction: remove,
    visitDeclareClass: remove,
    visitDeclareModule: remove,
    visitType: remove,
  });

  return ast;
}

var flowTypePreprocessor = {
    preprocess: function(text, filename) {
        currentInfos = compile(text, {souceFileName: filename, sourceMapName: "map.json"});
        return [currentInfos.code];
    },
    postprocess: function(messages) {
        var map = currentInfos.map;
        var SourceMapConsumer = require("source-map").SourceMapConsumer;
        var smc = new SourceMapConsumer(map);
        messages[0].forEach(function (message) {
          var originalPos = smc.originalPositionFor({
              line: message.line,
              column: message.column
          });
          message.line = originalPos.line;
          message.column = originalPos.column;
        });
        return messages[0];
    }
};

module.exports = {
    rules: {
        "dummyrule": function (context) {
            // rule implementation ...
        }
    },
    processors: {
        ".jsx": flowTypePreprocessor,
        ".js": flowTypePreprocessor,
        ".es6": flowTypePreprocessor
    }
};
