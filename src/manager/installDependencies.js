const path = require("path");
const fs = require("fs-extra");
const spawn = require("cross-spawn");
const chalk = require("chalk");
const { dependencies, devDependencies } = require("./dependencies");

function install(cwd) {
    console.log();
    console.log("Installing dependencies...");

    runInstall(
        dependencies,
        cwd,
        false
    );

    runInstall(
        devDependencies,
        cwd,
        true
    );
}

function runInstall(dependencies, installDir, dev = false) {
    console.log(`Installing ${dev ? "dev" : "main"} dependencies...`);

    const install = [];

    dependencies.forEach(({ name, version }) => {
        console.log(`    +installing ${chalk.bold.blue(name)} version in range ${chalk.green(version)}...`);

        install.push(`${name}@${version}`);
    });

    buildCommand(
        installDir,
        "npm",
        [
            "install",
            ...install,
            dev ? "--save-dev" : "--save"
        ]
    );

    console.log();
}

function buildCommand(cwd, command, args) {
    spawn.sync(
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

module.exports = {
    install,
    createProject
};
