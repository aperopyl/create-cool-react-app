#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const commander = require("commander");
const package = require("../package.json");

const checkProject = require("./checkFiles").checkProject;
const createProjectStructure = require("./manager/directories");
const { install, createProject } = require("./manager/installDependencies");

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

    install(path.join(process.cwd(), name));

    printSuccess(name);
}

function printSuccess(name) {
    console.log();
    console.log("Project created successfully!");
    console.log("Start by navigating to the project directory:");
    console.log();
    console.log(`    ${command("cd", name)}`);
    console.log();
    console.log("Start the development server:");
    console.log();
    console.log(`    ${command("npm", "start")}`);
    console.log();
    console.log("Any problems with your project try running:");
    console.log("It might catch any failed linkages.");
    console.log();
    console.log(`    ${command("create-cool-react-app", "--audit", name)}`);
    console.log();
}

function command(command, mainArg, ...args) {
    const argsAndFlags = args.map(arg => chalk.magenta(arg)).join(" ");

    return `${chalk.bold.green(command)} ${chalk.bold.cyan(mainArg)} ${argsAndFlags}`;
}
