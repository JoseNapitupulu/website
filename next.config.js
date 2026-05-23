module.exports = {
  webpack: (config) => {
    const path = require("path");
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  }
};

