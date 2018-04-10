const fs = require('fs');

module.exports = function generatePlugin(flow) {
    if (flow.bundle.content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(flow.output, flow.bundle.content, err => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        })
    }

    return null;
};
