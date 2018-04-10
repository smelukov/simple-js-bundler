const generate = require('@babel/generator').default;

module.exports = function generatePlugin(flow) {
    if (flow.bundle.ast) {
        flow.bundle.content = generate(flow.bundle.ast).code;
    }
};
