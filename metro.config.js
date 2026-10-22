const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Fewer parallel workers keeps Metro under the Windows open-file limit (EMFILE).
config.maxWorkers = 2;

module.exports = config;
