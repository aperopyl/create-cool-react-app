const semver = require("semver");
const failed = require("../throwError").failedProjectError;

/**
 * Checks each dependency and a valid semver string.
 */
function createDependencyObject(dependencies, packageDependencies) {
    dependencies.forEach(dependency => {
        if(!semver.validRange(dependency.version)) {
            failed(
                `Internal error. Please submit an issue! Semver: ${dependency.version}`
            );
        }

        packageDependencies[dependency.name] = dependency.version;
    });
}

function createPackageJson(
    name = "my-project",
    version = "1.0.0",
    description = "",
    dependencies = [],
    devDependencies = [],
    scripts = {}
) {
    const packageDependencies = {};
    const packageDevDependencies = {};

    createDependencyObject(dependencies, packageDependencies);
    createDependencyObject(devDependencies, packageDevDependencies);

    const package = {
        private: true,
        name,
        version,
        description,
        scripts,
        dependencies: packageDependencies,
        devDependencies: packageDevDependencies
    };

    return {
        filename: "package.json",
        contents: JSON.stringify(package, null, 2)
    };
}

module.exports = createPackageJson;
