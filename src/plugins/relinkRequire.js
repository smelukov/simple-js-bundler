const types = require('@babel/types');

module.exports = function generateIdPlugin(flow) {
    const scriptFiles = flow.files.filter(file => ['.js', '.jsx', '.es6'].includes(file.ext));

    for (const file of scriptFiles) {
        for (const dep of file.dependencies) {
            for (const source of dep.sources) {
                source.arguments[0] = types.numericLiteral(dep.file.id);
            }
        }
    }
};
