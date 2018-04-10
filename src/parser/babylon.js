const babylon = require('babylon');

const defaultParams = {
    sourceType: "module",
    plugins: ["jsx", "flow"],
};

module.exports = {
    parse(code, params = {}) {
        return babylon.parse(code, {
            ...defaultParams,
            ...params
        });
    },
    parseExpression(code, params = {}) {
        return babylon.parseExpression(code, {
            ...defaultParams,
            ...params
        });
    }
};
