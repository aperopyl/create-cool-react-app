const fs = require("fs-extra");
const chalk = require("chalk");

const lib = require("../package.json");
const failedProjectError = require("./throwError").failedProjectError;

// These files are considered valid when creating the project directory.
// They also won't be overwritten by project files.
const validFiles = [
    ".gitignore",
    ".idea",
    "LICENSE",
    "README.md",
    "docs",
    ".travis.yml",
    ".git",
    "web.iml",
    ".npmignore"
];

function checkProject(path) {
    const conflicts = fs
        .readdirSync(path)
        .filter(file => !validFiles.includes(file));

    if (conflicts.length > 0) {
        failedProjectError(
            `There were file conflicts in the project directory ${chalk.blue(path)}:`,
            conflicts.map(conflict => chalk.red(conflict))
        );
    }
}

module.exports = {
    validFiles,
    checkProject
};
