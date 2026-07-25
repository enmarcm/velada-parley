module.exports = {
  apps: [{
    name: "velada-parley-api",
    script: "src/index.js",
    cwd: __dirname,
    env: { NODE_ENV: "production" },
    max_restarts: 10,
    watch: false
  }]
};
