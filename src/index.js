const BuildFlow = require('./buildFlow');

const flow = new BuildFlow({
    context: '../example',
    entry: 'index.js',
    output: 'bundle.js',
    loaders: {
        '.js': require('./loaders/scripts'),
        '.es6': require('./loaders/scripts'),
        '.jsx': require('./loaders/scripts')
    },
    fileExts: ['.js', '.es6', '.jsx'],
    plugins: [
        require('./plugins/generateId'),
        require('./plugins/relinkRequire'),
        require('./plugins/bundle'),
        require('./plugins/generate'),
        require('./plugins/minify'),
        require('./plugins/flush')
    ]
});

(async () => {
    await flow.build();

    if (flow.errors.length) {
        flow.outputErrors();
    } else {
        console.log('Done');
    }
})();
