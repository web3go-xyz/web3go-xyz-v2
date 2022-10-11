module.exports = {
    apps: [{
        name: "12346-mbstoreapi",
        script: "./dist/main.js",
        max_memory_restart: '1024M',
        node_args: '--max-old-space-size=1024',
        args: '',
        env: { 
            PORT: 12346           
        }
    }]
} 