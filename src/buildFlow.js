const path = require('path');
const File = require('./file');

module.exports = class BuildFlow {
    constructor(config = {}) {
        this.files = [];
        this.context = path.resolve(config.context || process.cwd());
        this.output = path.resolve(this.context, config.output || 'bundle.js');
        this.loaders = config.loaders || {};
        this.plugins = config.plugins || [];
        this.fileExts = config.fileExts || [];
        this.errors = [];
        this.hasCriticalError = false;

        this.addFile(config.entry);
    }

    addFile(path) {
        const file = new File(path, this);

        if (!file.invalid) {
            for (const existingFile of this.files) {
                if (existingFile.absPath === file.absPath) {
                    return existingFile;
                }
            }

            this.files.push(file);
            return file;
        }

        return null;
    }

    addError(error, isCritical) {
        if (!(error instanceof Error)) {
            this.errors.push(new Error(error));
        } else {
            this.errors.push(error);
        }

        this.hasCriticalError = this.hasCriticalError || isCritical;
    }

    outputErrors() {
        for (const error of this.errors) {
            console.error(error);
        }
    }

    async buildGraph() {
        for (const file of this.files) {
            if (this.loaders.hasOwnProperty(file.ext)) {
                await this.loaders[file.ext](this, file);

                if (this.hasCriticalError) {
                    return;
                }
            }
        }
    }

    async bundleModules() {
        for (const plugin of this.plugins) {
            await plugin(this);

            if (this.hasCriticalError) {
                return;
            }
        }
    }

    async build() {
        await this.buildGraph();
        await this.bundleModules();
    }
};
