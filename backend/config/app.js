const appConfig = {
    port: process.env.PORT || 8080,
    jwtSecret: process.env.JWT_SECRET || "secret",
    webURL: process.env.WEB_URL || "http://localhost:3000",
    env: process.env.NODE_ENV || "development"
}

module.exports = appConfig;