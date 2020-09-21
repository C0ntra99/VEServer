const config={
    "endpoints":[ 
        {
            "name":"Team",
            "route":"/api/team",
            "app_path":"./routes/api/team"
        },
        {
            "name":"Round",
            "route":"/api/round",
            "app_path":"./routes/api/round"
        },
        {
            "name":"Instance",
            "route":"/api/instance",
            "app_path":"./routes/api/instance"
        }
    ],
    "globals":{
        "mongodb":"mongodb://localhost:27017/VibeEngine",
        "logging":{
            "path":"./logs",
            "level":"debug",
            "maxSize":"5m",
            "maxFiles":"100"
        }
    }
}

module.exports = config;