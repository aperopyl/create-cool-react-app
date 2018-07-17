const path = require("path");
const fs = require("fs-extra");
const spawn = require("cross-spawn");
const chalk = require("chalk");

function install(cwd) {
    buildCommand(
        "npm",
        cwd,
        [
            "install"
        ]
    );
}

function buildCommand(command, cwd, ...args) {
    spawn(
        command,
        args,
        {
            stdio: "inherit",
            cwd
        }
    );
}

/**
 * Writes the files in the specified structure.
 *
 * @param {object[]} structure created by `createProjectStructure()`
 * @param {string} directory directory from cwd
 */
function createProject(structure, project) {
    return createProjectInternal(structure, project);
}

function createProjectInternal(
    structure,
    project,
    directory = ["./"],
    copyDirectory = ["./"]
) {
    const defaultProjectName = "my-project";
    const cwd = process.cwd();
    const copyPath = __dirname;
    const written = [];

    if (!structure) {
        return;
    }

    structure.forEach(({ name, directories, files, entry }) => {
        // Destination for files and directories
        const dest = path.join(
            cwd,
            ...directory,
            name
        );

        // Copy files from
        const copy = path.join(
            copyPath,
            ...copyDirectory,
            entry ? defaultProjectName : name
        );

        let from;
        let to;

        fs.ensureDirSync(dest);

        console.log();
        console.log(`Writing ${files.length} files in directory ${dest}/...`);

        if (files) {
            files.forEach(file => {
                if (typeof file === "string") {
                    console.log(`    Creating file ${chalk.bold.green(file)}...`);

                    from = path.resolve(copy, file);
                    to = path.resolve(dest, file);

                    if (!fs.existsSync(from)) {
                        console.log(
                            `    ${chalk.bold.red("!!!")} ${from} doesn't exist! Aborting...`
                        );

                        return;
                    }

                    fs.copySync(
                        from,
                        to
                    );

                    // Written files are absolute paths
                    written.push(to);
                } else {
                    fs.writeFileSync(
                        path.resolve(dest, file.filename),
                        file.contents
                    );
                }
            });
        }

        if (directories) {
            const nextDir = entry ?
                [...copyDirectory, defaultProjectName] :
                [...copyDirectory, name];

            const recursivelyWrittenFiles = createProjectInternal(
                directories,
                project,
                [...directory, name],
                nextDir
            );

            written.push(...recursivelyWrittenFiles);
        }
    });

    return written;
}

module.exports = createProject;
