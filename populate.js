require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		await Product.deleteMany(); // delete all existing data from the db
		await Product.create(jsonProducts); // populate the collection
		console.log("Finished Populating the DB");
    process.exit(0); // Success
	} catch (error) {
		console.log(error);
		process.exit(1); // Failed
	}
};
start();
