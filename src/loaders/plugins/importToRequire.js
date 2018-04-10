const traverse = require('@babel/traverse').default;
const types = require('@babel/types');

module.exports = function(flow, file) {
    if (!file.ast) {
        return;
    }

    traverse(file.ast, {
        ImportDeclaration(context) {
            const [defaultSpecifier] = context.node.specifiers.filter(specifier => specifier.type === 'ImportDefaultSpecifier');
            const specifiers = context.node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier');

            if (defaultSpecifier) {
                context.replaceWith(
                    types.variableDeclaration('const', [
                        types.variableDeclarator(
                            types.identifier(defaultSpecifier.local.name),
                            types.callExpression(types.identifier('require'), [context.node.source]))
                    ])
                )
            } else if (specifiers.length) {
                context.replaceWith(
                    types.variableDeclaration('const', [
                        types.variableDeclarator(
                            types.objectPattern(specifiers.map(specifier => types.objectProperty(specifier.local, specifier.local, false, true))),
                            types.callExpression(types.identifier('require'), [context.node.source]))
                    ])
                )
            }
        }
    }, file.ast);
};
