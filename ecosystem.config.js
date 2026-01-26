module.exports = {
  apps: [
    {
      name: "n8n",
      script: "C:/Docker/N8N-PROD/n8n-local/node_modules/n8n/bin/n8n",
      env: {
        N8N_ENCRYPTION_KEY: "b7a9f82d3e1c4b5a6d7e8f90a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
        N8N_SECURE_COOKIE: "false",
        NODE_FUNCTION_ALLOW_EXTERNAL: "*",
        N8N_USER_FOLDER: "C:/Docker/N8N-PROD/n8n-local/.n8n"
      }
    },
    {
      name: "evolution-api",
      script: "C:/Docker/N8N-PROD/evolution-api/dist/main.js",
      cwd: "C:/Docker/N8N-PROD/evolution-api"
    }
  ]
}