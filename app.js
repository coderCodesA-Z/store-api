require("dotenv").config();
require("express-async-errors"); // async-errors

const express = require("express");

const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const productsRouter = require("./routes/products");

const app = express();

// common middlewares
app.use(express.json());

// routes
app.use("/api/v1/products", productsRouter);

// custom middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
	try {
    // connectDB
		await connectDB(process.env.MONGO_URI);
		app.listen(PORT, (err) => {
			if (err) console.log(`Some error occurred within Server, err = ${err}`);
			else console.log(`Server listening on PORT = ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};
start();
