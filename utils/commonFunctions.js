const parseCommaSeparatedValues = (queryParam) => {
	return queryParam
		?.split(",")
		?.map((query) => removePeriodsAndSpaces(query))
		?.join(" ");
};

const removePeriodsAndSpaces = (str) => {
	// Remove leading and trailing spaces
	const trimmedStr = str.trim();

	// Remove spaces and periods(.) in between (using regular expression)
	const cleanedStr = trimmedStr.replace(/[.\s]/g, "");
	return cleanedStr;
};

module.exports = { parseCommaSeparatedValues, removePeriodsAndSpaces };
