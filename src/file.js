const path = require('path');
const fs = require('fs');

module.exports = class File {
    constructor(filePath, flow) {
        let absPath = path.resolve(flow.context, filePath);

        this.flow = flow;
        this.absPath = this.resolveExt(absPath);

        if (!this.absPath) {
            flow.addError(`File ${absPath} not found`, true);
            this.invalid = true;
            return;
        }

        this.relPath = path.relative(flow.context, this.absPath);
        this.dirName = path.dirname(this.absPath);
        this.ext = path.extname(this.absPath);
        this.name = path.basename(this.absPath);
        this.dependencies = [];
        this.dependencyFor = []
    }

    resolveExt(filePath) {
        if (!fs.existsSync(filePath)) {
            for (const ext of this.flow.fileExts) {
                if (fs.existsSync(filePath + ext)) {
                    return filePath + ext;
                }
            }

            return null;
        }

        return filePath;
    }

    content() {
        if (this.cachedContent) {
            return this.cachedContent;
        }

        return new Promise((resolve, reject) => {
            fs.readFile(this.absPath, 'utf8', (err, content) => {
                if (err) {
                    return reject(err);
                }

                this.cachedContent = content;

                return resolve(this.cachedContent);
            });
        });
    }

    addDependency(file, source) {
        const [existingDep] = this.dependencies.filter(dep => dep.file === file) || [];

        if (existingDep) {
            if (!existingDep.sources.includes(source)) {
                existingDep.sources.push(source);
            }
        } else {
            this.dependencies.push({ file, sources: [source] });
        }

        const [existingDepFor] = file.dependencyFor.filter(dep => dep.file === this) || [];

        if (existingDepFor) {
            if (!existingDepFor.sources.includes(source)) {
                existingDepFor.sources.push(source);
            }
        } else {
            file.dependencyFor.push({ file: this, sources: [source] });
        }
    }
};
