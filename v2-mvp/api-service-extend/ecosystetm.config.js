module.exports = {
    apps: [{
        name: "12350-web3go-v2-mvp-api-service-extend",
        script: "./dist/main.js",
        max_memory_restart: '2048M',
        node_args: '--max-old-space-size=2048',
        args: '',
        env: {
            PORT: 12350,
            DB_TYPE: "postgres",
            DB_HOST: "dev-v2.web3go.xyz",
            DB_PORT: 5432,
            DB_USERNAME: "postgres",
            DB_PASSWORD: "Dev123!@#",

            DB_DATABASE: "dev-web3go-v2-extend",
            DB_DATABASE_METABASE: "dev-web3go-v2-metabase",

            REDIS_HOST: "dev-v2.web3go.xyz",  // host for redis, use default password

            BASE_API_URL: "https://dev-v2.web3go.xyz/api-ext",       // api prefix of api extend service
            BASE_WEB_URL: "https://dev-v2.web3go.xyz",              // domain of web page
            BASE_METABASE_API_URL: "https://dev-v2.web3go.xyz/api", // api prefix of metabase service
            DASHBOARD_PUBLIC_COLLECTION_ID: 40   //all dashboards will be placed under this public collection.
        }
    }]
} 