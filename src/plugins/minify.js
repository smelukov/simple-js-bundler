const UglifyES = require('uglify-es');

module.exports = function uglifyPlugin(flow) {
    if (flow.bundle.content) {
        const result = UglifyES.minify(flow.bundle.content, {
            compress: true,
            mangle: true
        });

        if (result.warnings) {
            result.warnings.forEach(warn => flow.addError(warn));
        }

        if (result.error) {
            flow.addError(result.error, true);
        } else {
            flow.bundle.content = result.code;
        }
    }
};
