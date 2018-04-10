const traverse = require('@babel/traverse').default;
const path = require('path');

module.exports = function(flow, file) {
    if (!file.ast) {
        return;
    }

    traverse(file.ast, {
        CallExpression(context) {
            if (context.node.callee.name === 'require') {
                const [requirePath] = context.node.arguments;

                if (requirePath) {
                    let absRequirePath;

                    if (requirePath.type === 'Literal' || requirePath.type === 'StringLiteral') {
                        absRequirePath = path.resolve(file.dirName, requirePath.value);
                    } else if (requirePath.type === 'Identifier') {
                        const binding = context.scope.getBinding(requirePath.name);

                        if (binding) {
                            const bindingNode = binding.path.node;

                            if (bindingNode.type === 'VariableDeclarator') {
                                absRequirePath = path.resolve(file.dirName, bindingNode.init.value);
                            }
                        }
                    }

                    const newFile = flow.addFile(absRequirePath);

                    if (newFile) {
                        file.addDependency(newFile, context.node);
                    }
                }
            }
        }
    });
};
