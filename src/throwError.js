const chalk = require("chalk");
const lib = require("../package.json");

function createError(title) {
    return function (
        description = "An error occurred",
        trace = []
    ) {
        console.error(title);
        console.log(description);

        trace.forEach(trace => console.log(`    ${trace}`));

        process.exit(1);
    };
}

const failedProjectError = createError(
    `${chalk.blue(lib.name)} was unable to create a project`
);

module.exports = {
    createError,
    failedProjectError
};
