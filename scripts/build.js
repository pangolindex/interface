/* eslint-disable */
const { spawn } = require('child_process')

// console.log('setting NODE_OPTIONS to --max-old-space-size=8192')
// Step 1: Set the environment variable
// process.env.NODE_OPTIONS = '--max-old-space-size=8192'

// Step 2: Run the "yarn build" command
const yarnBuild = spawn('yarn', ['vite:build'], {
  stdio: 'inherit', // This option will pipe the stdio of the child process to the parent, effectively displaying it in the terminal.
  shell: true, // This option will run the command in a shell, allowing for environment variable expansion.
  env: process.env // Pass the modified environment variables to the child process.
})

// Step 4: Handle errors (though with 'stdio: inherit', errors will be displayed automatically)
yarnBuild.on('error', error => {
  console.error(`Error executing "yarn build": ${error}`)
})

yarnBuild.on('close', code => {
  if (code !== 0) {
    console.error(`"yarn build" exited with code ${code}`)
    console.log('spawning another build')
    spawn('yarn', ['vite:build'], {
      stdio: 'inherit', // This option will pipe the stdio of the child process to the parent, effectively displaying it in the terminal.
      shell: true, // This option will run the command in a shell, allowing for environment variable expansion.
      env: process.env // Pass the modified environment variables to the child process.
    })
  }
})
/* eslint-enable */
