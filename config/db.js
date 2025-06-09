const postgres = require ('postgres')
const connectionString = process.env.SESSION_URL
const sql = postgres(connectionString, {
    ssl: connectionString.includes('supabase') ? 'require' : false,  // 👈 prevent SSL issues
})

module.exports =  {sql}