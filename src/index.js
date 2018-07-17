#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const commander = require("commander");
const package = require("../package.json");

const checkProject = require("./checkFiles").checkProject;
const createProjectStructure = require("./manager/directories");
const createProject = require("./manager/installDependencies");

let projectName;

const program = commander
    .version(package.version)
    // .command(package.name)
    .arguments("<project-name>")
    .action(command => {
        projectName = command;
    })
    .usage(`${chalk.green("<project-name>")} [options]`)
    .description("create a React project in the specified directory")
    .option("--verbose", "print detailed logs")
    .parse(process.argv);

if (!projectName) {
    console.error("Please specify a name for your project!");

    process.exit(1);
}

create(projectName);

function create(name) {
    console.clear();
    console.log(`${chalk.blue(package.name)} is creating your project...`);
    console.log(`Creating project: ${chalk.cyan(projectName)}...`);

    const project = path.resolve(name);

    fs.ensureDirSync(project);

    checkProject(project);

    const written = createProject(createProjectStructure(name), name);

    printSuccess(name);
}

function printSuccess(name) {
    console.log("Project created successfully!");
    console.log("Start by navigating to the project directory:");
    console.log();
    console.log(`    ${chalk.bold.green("cd")} ${chalk.cyan(name)}`);
    console.log();
}
