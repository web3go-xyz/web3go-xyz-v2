module.exports = {
    apps: [{
        name: "12350-api-service-extend",
        script: "./dist/main.js",
        max_memory_restart: '2048M',
        node_args: '--max-old-space-size=2048',
        args: '',
        env: {
            PORT: 12350,
            DB_TYPE: "postgres",
            DB_HOST: "localhost",
            DB_PORT: 5432,
            DB_USERNAME: "postgres",
            DB_PASSWORD: "Dev123!@#",

            DB_DATABASE: "dev-web3go-v2-extend",
            DB_DATABASE_METABASE: "dev-web3go-v2-metabase",
        }
    }]
} 