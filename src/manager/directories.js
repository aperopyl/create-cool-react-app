const createPackageJson = require("./createPackageJson");
const { dependencies, devDependencies } = require("./dependencies");

const scripts = {
    "start": "webpack-dev-server",
    "build": "NODE_ENV=production webpack",
    "build:dev": "webpack"
};

/**
 * Virtual directory structure to install to the given path.
 */
const createProjectStructure = (
    projectName = "my-project"
) => [
    {
        entry: true,
        name: projectName,
        directories: [
            {
                name: "assets",
                files: [
                    "config.js",
                    "index.html"
                ]
            },
            {
                name: "src",
                files: [
                    "App.js",
                    "App.scss",
                    "env.js",
                    "index.js"
                ]
            }
        ],
        files: [
            "webpack.config.js",
            ".eslintrc.js",
            ".babelrc",
            "README.md",
            createPackageJson(
                projectName,
                "1.0.0",
                "Project bootstrapped with create-cool-react-app",
                dependencies,
                devDependencies,
                scripts
            )
        ]
    }
];

module.exports = createProjectStructure;
