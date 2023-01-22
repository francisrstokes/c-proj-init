#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

const panic = (message, exitCode = 1) => {
  console.log(message);
  process.exit(exitCode);
};

const getTemplatePath = (template) => path.join(__dirname, 'templates', template);

const readAndPopulateTemplate = (template) => {
  const file = fs.readFileSync(getTemplatePath(template), 'utf8');
  return file.replace('{{app-name}}', appName);
}

const numExpectedArguments = 2;
if (process.argv.length < 2 + numExpectedArguments) {
  panic([
    "usage: c-proj-init <app name> <project path>",
    "",
    "       <app name>: Name of the application.",
    "       <project path>: Path to the folder where this project should be created."
  ].join("\n"));
}

const appName = process.argv[2]
const projectPath = process.argv[3];

const srcFolderPath = path.join(projectPath, "src");
const incFolderPath = path.join(projectPath, "inc");
const vscodeFolderPath = path.join(projectPath, ".vscode");

const foldersToCreate = [
  projectPath,
  srcFolderPath,
  incFolderPath,
  vscodeFolderPath,
];

for (const folder of foldersToCreate) {
  fs.mkdirpSync(folder);
}

const filesToCreate = [
  { templateName: "Makefile",     targetPath: path.join(projectPath, "Makefile")          },
  { templateName: "launch.json",  targetPath: path.join(vscodeFolderPath, "launch.json")  },
  { templateName: "tasks.json",   targetPath: path.join(vscodeFolderPath, "tasks.json")   },
  { templateName: "main.c",       targetPath: path.join(srcFolderPath, "main.c")          },
  { templateName: "common.h",     targetPath: path.join(incFolderPath, "common.h")        },
];

for (const {templateName, targetPath} of filesToCreate) {
  const templated = readAndPopulateTemplate(templateName);
  fs.writeFileSync(targetPath, templated);
}
