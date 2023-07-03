import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
    entry: "./src/index.ts",
    target: "node",
    experiments: {
        outputModule: true,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.mjs",
        module: true,
        chunkFormat: 'module',
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
        ],
    },
};

export default config;