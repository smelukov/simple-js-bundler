const types = require('@babel/types');
const parser = require('../parser/babylon');

module.exports = function bundlePlugin(flow) {
    const scriptFiles = flow.files.filter(file => ['.js', '.jsx', '.es6'].includes(file.ext));
    const modulesObjectProps = [];
    const bundleBody = [
        ...parser.parse(`
        const cache = {};

        function require(name) {
            if(cache.hasOwnProperty(name)) {
                return cache[name];
            }
            
            const module = { exports: {} };
            
            return cache[name] = modules[name](module, module.exports, require);
        }
        `).program.body,
        types.variableDeclaration('const', [
            types.variableDeclarator(
                types.identifier('modules'),
                types.objectExpression(modulesObjectProps))
        ]),
        ...parser.parse('require(0)').program.body
    ];
    flow.bundle = {
        ast: types.file(
            types.program([
                    types.expressionStatement(
                        types.callExpression(types.arrowFunctionExpression([], types.blockStatement(bundleBody)), [])
                    )
                ]
            )
        )
    };

    for (const file of scriptFiles) {
        modulesObjectProps.push(
            types.objectProperty(
                types.numericLiteral(file.id),
                types.functionExpression(
                    null,
                    [
                        types.identifier('module'),
                        types.identifier('exports'),
                        types.identifier('require')
                    ],
                    types.blockStatement([
                        ...file.ast.program.body,
                        types.returnStatement(types.memberExpression(types.identifier('module'), types.identifier('exports')))
                    ])
                )
            )
        );
    }
};
