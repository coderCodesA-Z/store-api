const Product = require("../models/product");

const { parseCommaSeparatedValues } = require("../utils/commonFunctions");

const operatorMap = require("../utils/operatorMap");

const getAllProducts = async (req, res) => {
	const {
		isFeatured,
		company,
		productName,
		sorting,
		selectedFields,
		limit,
		// skip,
		page,
		numericFilters,
	} = req.query;
	const queryObject = {};

	// filter products based on params
	if (isFeatured) queryObject.isFeatured = isFeatured === "true";
	if (company) queryObject.company = company;
	if (productName)
		queryObject.productName = { $regex: productName, $options: "i" };

	// sort products based on params
	const sortList = parseCommaSeparatedValues(sorting) || "createdAt";

	// display only selected fields
	const fieldList = parseCommaSeparatedValues(selectedFields) || "";

	// pagination
	const pageVal = Math.abs(+page) || 1;

	// limit the number of products
	const limitVal = Math.abs(+limit) || 10;

	// skip the number of products
	const skipVal = (pageVal - 1) * limitVal;

	// totalPages = (totalProducts)/limitVal + 1;

	// numericFilters
	if (numericFilters) {
		const regEx = /\b(<|>|>=|=|<|<=)\b/g;

		let filters = parseCommaSeparatedValues(numericFilters)
			.split(" ")
			.join(",");
		filters = filters.replace(regEx, (match) => `-${operatorMap[match]}-`);

		const options = ["price", "rating"];
		filters = filters.split(",").forEach((item) => {
			const [field, operator, value] = item.split("-");
			if (options.includes(field)) {
				queryObject[field] = { [operator]: +value };
			}
		});
	}

	let products = await Product.find(queryObject)
		.sort(sortList)
		.select(fieldList)
		.limit(limitVal)
		.skip(skipVal);
	res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts };
