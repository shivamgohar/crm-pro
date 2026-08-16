const fs = require("fs");
const path = require("path");

exports.default = async function (context) {
  if (context.electronPlatformName !== "win32") {
    return;
  }

  const projectRoot = context.packager.projectDir;

  const sourceServer = path.join(
    projectRoot,
    "server"
  );

  const targetServer = path.join(
    context.appOutDir,
    "resources",
    "server"
  );

  const sourceNodeModules = path.join(
    sourceServer,
    "node_modules"
  );

  const targetNodeModules = path.join(
    targetServer,
    "node_modules"
  );

  console.log("==========================================");
  console.log("CRM PRO afterPack");
  console.log("Copying server node_modules...");
  console.log("Source:", sourceNodeModules);
  console.log("Target:", targetNodeModules);
  console.log("==========================================");

  if (!fs.existsSync(sourceNodeModules)) {
    throw new Error(
      `Server node_modules not found: ${sourceNodeModules}`
    );
  }

  fs.mkdirSync(targetServer, {
    recursive: true,
  });

  fs.cpSync(
    sourceNodeModules,
    targetNodeModules,
    {
      recursive: true,
      force: true,
    }
  );

  const expressPath = path.join(
    targetNodeModules,
    "express"
  );

  if (!fs.existsSync(expressPath)) {
    throw new Error(
      "Express was not copied into packaged server."
    );
  }

  console.log(
    "✓ Server node_modules copied successfully."
  );

  console.log(
    "✓ Express found in packaged server."
  );
};