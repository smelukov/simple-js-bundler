module.exports = function generateIdPlugin(flow) {
    let moduleIndex = 0;

    for (const file of flow.files) {
        file.id = moduleIndex++;
    }
};
