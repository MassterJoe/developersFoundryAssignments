require('dotenv').config();
var express = require('express');
const cookieParser = require("cookie-parser");
const connectDb = require('./config/db'); 
const { requestLogger, errorLogger } = require('./handlers/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./config/swaggerConfig'); // Import the configuration

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const cors = require("cors");

const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');




var app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));


app.use(requestLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorLogger);
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
    connectDb(); 
});
                 