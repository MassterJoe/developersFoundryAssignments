const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'TodoApp API',
        version: '1.0.0',
        description: 'API documentation for the TodoApp project',
      },
      servers: [
        {
          url: 'http://localhost:5000/api',
          description: 'Development server',
        },
        {
          url: 'https://dfassignment.onrender.com/api',
          description: 'Production server'
        }
      ],
    },
    apis: ['./routes/*.js']
  };
  
  module.exports = swaggerOptions;
  