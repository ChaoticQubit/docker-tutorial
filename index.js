const express = require('express');
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');
const session = require('express-session');
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
const cors = require('cors');
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
});

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const connectWithRetry = () => {
    // Connect to MongoDB
    const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
    mongoose.set('strictQuery', false);
    mongoose
        .connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true})
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => {
            console.log(err)
            setTimeout(connectWithRetry, 5000)
        });

}

connectWithRetry();

app.enable("trust proxy");
app.use(cors({}));

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000
    }
}));


app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Helo Chodumal!</h1>");
    console.log("edfcsdfcesdfcdeswc!!!!");
});





app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));