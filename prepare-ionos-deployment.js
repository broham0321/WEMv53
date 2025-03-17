const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Configuration
const config = {
  sourceDir: ".",
  outputDir: "./out",
  deploymentDir: "./ionos-deployment",
  includeFiles: [".htaccess", "robots.txt", "403.html", "404.html"],
}

console.log("🚀 Preparing deployment for IONOS Deploy Now...")

// Step 1: Build the Next.js application
console.log("\n📦 Building Next.js application...")
try {
  execSync("npm run build", { stdio: "inherit" })
} catch (error) {
  console.error("❌ Build failed:", error)
  process.exit(1)
}

// Step 2: Create deployment directory
console.log("\n📁 Creating deployment directory...")
if (fs.existsSync(config.deploymentDir)) {
  fs.rmSync(config.deploymentDir, { recursive: true, force: true })
}
fs.mkdirSync(config.deploymentDir, { recursive: true })

// Step 3: Copy the static export to the deployment directory
console.log("\n📋 Copying static export to deployment directory...")
if (fs.existsSync(config.outputDir)) {
  const copyDirRecursive = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }

    const entries = fs.readdirSync(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      if (entry.isDirectory()) {
        copyDirRecursive(srcPath, destPath)
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    }
  }

  copyDirRecursive(config.outputDir, config.deploymentDir)
} else {
  console.error("❌ Build output directory not found. Make sure the build completed successfully.")
  process.exit(1)
}

// Step 4: Copy additional files
console.log("\n📄 Copying additional files...")
config.includeFiles.forEach((file) => {
  const sourcePath = path.join(config.sourceDir, file)
  const destPath = path.join(config.deploymentDir, file)

  if (fs.existsSync(sourcePath)) {
    // Create the destination directory if it doesn't exist
    fs.mkdirSync(path.dirname(destPath), { recursive: true })

    // Copy the file
    fs.copyFileSync(sourcePath, destPath)
    console.log(`  ✅ Copied: ${file}`)
  } else {
    console.log(`  ⚠️ File not found, skipping: ${file}`)
  }
})

// Step 5: Create a deployment info file
const packageJson = require("../package.json")
const deploymentInfo = {
  name: packageJson.name,
  version: packageJson.version,
  deployedAt: new Date().toISOString(),
  type: "static",
}

fs.writeFileSync(path.join(config.deploymentDir, "deployment-info.json"), JSON.stringify(deploymentInfo, null, 2))

// Step 6: Create a simple verification HTML file
const verificationHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deployment Verification</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; }
    .success { color: #22c55e; }
    .card { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>Deployment Verification</h1>
  <div class="card">
    <h2 class="success">✅ Deployment Successful!</h2>
    <p>If you can see this page, your static deployment is working correctly.</p>
    <p>Deployed: ${new Date().toLocaleString()}</p>
  </div>
  <p><a href="/">Go to Homepage</a></p>
</body>
</html>
`

fs.writeFileSync(path.join(config.deploymentDir, "verification.html"), verificationHtml)

console.log("\n✅ Deployment preparation complete!")
console.log(`\nYour deployment files are ready in: ${config.deploymentDir}`)
console.log("\nNext steps:")
console.log("1. Upload the contents of this directory to IONOS Deploy Now")
console.log("2. Follow the IONOS deployment guide in the README")

