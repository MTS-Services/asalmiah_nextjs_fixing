const swaggerAutogen = require("swagger-autogen")();

const process = require("process");
require("dotenv").config();
const doc = {
    info: {
        version: "1.0.0",
        title: `${process.env.PROJECT_NAME} API's`,
        description:
            `API documentation for ${process.env.PROJECT_NAME} Project`,
    },
    host: process.env.SWAGGER_SERVER_IP,
    basePath: "/api/",

    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
        Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description:
                "Enter your bearer token in the format **Bearer &lt;token>**",
        },
    },
};

const swaggerJsonfile = "../../swagger.json";
const swaggerEndpointsFiles = ["../../routes/swaggerRoutes"];


swaggerAutogen(swaggerJsonfile, swaggerEndpointsFiles, doc).then(() => {
    console.log('swagger Generated successfully');
});