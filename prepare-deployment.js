const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Configuration
const config = {
  sourceDir: ".", // Root of your project
  deploymentDir: "./deployment", // Where to create the deployment folder
  includeDirs: [
    ".next", // Next.js build output
    "public", // Static files
    "node_modules", // Dependencies (optional, can be installed on the server)
  ],
  includeFiles: ["package.json", "package-lock.json", ".htaccess", "next.config.mjs", ".deploy-now/config.yaml"],
  excludePatterns: [/\.git/, /\.github/, /node_modules\/\.[^/]+/, /\.next\/cache/],
}

// Create deployment directory
console.log("Creating deployment directory...")
if (fs.existsSync(config.deploymentDir)) {
  fs.rmSync(config.deploymentDir, { recursive: true, force: true })
}
fs.mkdirSync(config.deploymentDir, { recursive: true })

// Build the Next.js application
console.log("Building Next.js application...")
try {
  execSync("npm run build", { stdio: "inherit" })
} catch (error) {
  console.error("Build failed:", error)
  process.exit(1)
}

// Copy directories
config.includeDirs.forEach((dir) => {
  const sourcePath = path.join(config.sourceDir, dir)
  const destPath = path.join(config.deploymentDir, dir)

  if (fs.existsSync(sourcePath)) {
    console.log(`Copying directory: ${dir}`)

    // Create the destination directory
    fs.mkdirSync(path.dirname(destPath), { recursive: true })

    // Function to copy directory recursively
    const copyDirRecursive = (src, dest) => {
      // Create destination directory if it doesn't exist
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
      }

      // Read source directory
      const entries = fs.readdirSync(src, { withFileTypes: true })

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)

        // Skip if matches exclude pattern
        if (config.excludePatterns.some((pattern) => pattern.test(srcPath))) {
          continue
        }

        if (entry.isDirectory()) {
          // Recursively copy directory
          copyDirRecursive(srcPath, destPath)
        } else {
          // Copy file
          fs.copyFileSync(srcPath, destPath)
        }
      }
    }

    copyDirRecursive(sourcePath, destPath)
  } else {
    console.warn(`Warning: Directory not found: ${dir}`)
  }
})

// Copy individual files
config.includeFiles.forEach((file) => {
  const sourcePath = path.join(config.sourceDir, file)
  const destPath = path.join(config.deploymentDir, file)

  if (fs.existsSync(sourcePath)) {
    console.log(`Copying file: ${file}`)

    // Create the destination directory
    fs.mkdirSync(path.dirname(destPath), { recursive: true })

    // Copy the file
    fs.copyFileSync(sourcePath, destPath)
  } else {
    console.warn(`Warning: File not found: ${file}`)
  }
})

// Create a deployment info file
const deploymentInfo = {
  name: require("../package.json").name,
  version: require("../package.json").version,
  deployedAt: new Date().toISOString(),
  nodeVersion: process.version,
}

fs.writeFileSync(path.join(config.deploymentDir, "deployment-info.json"), JSON.stringify(deploymentInfo, null, 2))

// Create a simple server.js file for Node.js environments
const serverJs = `
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 8080;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(\`> Ready on http://localhost:\${port}\`);
  });
});
`

fs.writeFileSync(path.join(config.deploymentDir, "server.js"), serverJs)

// Create a README.md file with deployment instructions
const readmeMd = `
# Deployment Package

This folder contains all the files needed to deploy the Next.js application.

## Deployment Instructions

### Option 1: Node.js Server

1. Upload all files to your server
2. Install dependencies: \`npm install --production\`
3. Start the server: \`npm start\`

### Option 2: Static Export (if applicable)

If you're deploying to a static hosting service:

1. Upload the contents of the \`.next/static\` directory to a CDN (optional)
2. Upload the contents of the \`out\` directory to your hosting service

### Option 3: IONOS Deploy Now

Follow the instructions in the IONOS-DEPLOY-GUIDE.md file in the root directory.

## Files and Directories

- \`.next/\`: Next.js build output
- \`public/\`: Static assets
- \`node_modules/\`: Dependencies
- \`package.json\` & \`package-lock.json\`: Project configuration
- \`.htaccess\`: Apache server configuration
- \`server.js\`: Simple Node.js server for running the application
- \`deployment-info.json\`: Information about this deployment package
`

fs.writeFileSync(path.join(config.deploymentDir, "README.md"), readmeMd)

console.log("Deployment folder created successfully!")

