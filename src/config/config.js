import dotenv from 'dotenv'

dotenv.config()

export default {
    persistence: process.env.PERSISTENCE,
    mongoUrl: process.env.MONGO_URL,
    githubSecret: process.env.GITHUB_SECRET,
    port: process.env.PORT,
}
