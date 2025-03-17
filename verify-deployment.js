const fs = require("fs")
const path = require("path")

// Configuration
const deploymentDir = "./deployment"
const requiredFiles = ["package.json", ".htaccess", "next.config.mjs", "server.js", "README.md", "deployment-info.json"]
const requiredDirs = [".next", "public"]

console.log("Verifying deployment folder...")

// Check if deployment directory exists
if (!fs.existsSync(deploymentDir)) {
  console.error("❌ Deployment directory does not exist!")
  console.log('Run "npm run prepare-deployment" to create it.')
  process.exit(1)
}

// Check required files
const missingFiles = []
for (const file of requiredFiles) {
  const filePath = path.join(deploymentDir, file)
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file)
  }
}

if (missingFiles.length > 0) {
  console.error("❌ Missing required files:")
  missingFiles.forEach((file) => console.log(`  - ${file}`))
} else {
  console.log("✅ All required files are present.")
}

// Check required directories
const missingDirs = []
for (const dir of requiredDirs) {
  const dirPath = path.join(deploymentDir, dir)
  if (!fs.existsSync(dirPath)) {
    missingDirs.push(dir)
  }
}

if (missingDirs.length > 0) {
  console.error("❌ Missing required directories:")
  missingDirs.forEach((dir) => console.log(`  - ${dir}`))
} else {
  console.log("✅ All required directories are present.")
}

// Check .next directory content
const nextDir = path.join(deploymentDir, ".next")
if (fs.existsSync(nextDir)) {
  const hasServerDir = fs.existsSync(path.join(nextDir, "server"))
  const hasStaticDir = fs.existsSync(path.join(nextDir, "static"))

  if (!hasServerDir || !hasStaticDir) {
    console.warn("⚠️ The .next directory may be incomplete:")
    if (!hasServerDir) console.log("  - Missing server directory")
    if (!hasStaticDir) console.log("  - Missing static directory")
  } else {
    console.log("✅ .next directory structure looks good.")
  }
}

// Final verdict
if (missingFiles.length === 0 && missingDirs.length === 0) {
  console.log("✅ Deployment folder verification passed!")
  console.log("Your application is ready to be deployed.")
} else {
  console.error("❌ Deployment folder verification failed!")
  console.log('Please run "npm run prepare-deployment" to fix the issues.')
}

