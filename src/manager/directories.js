const createPackageJson = require("./createPackageJson");
const { dependencies, devDependencies } = require("./dependencies");

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
                name: "src",
                files: [
                    "App.js",
                    "App.scss"
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
                {}
            )
        ]
    }
];

module.exports = createProjectStructure;
