const parser = require('../parser/babylon');
const plugins = [
    require('./plugins/importToRequire'),
    require('./plugins/require')
];

module.exports = async function(flow, file) {
    const content = await file.content();
    const ast = file.ast || parser.parse(content);

    file.ast = ast;

    for (const plugin of plugins) {
        await plugin(flow, file);
    }
};
