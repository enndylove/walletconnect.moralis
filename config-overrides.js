module.exports = function override(config, env) {
    config.plugins.push(new NodePolyfillPlugin({
        excludeAliases: ["console"]
    }))
    return config
}
