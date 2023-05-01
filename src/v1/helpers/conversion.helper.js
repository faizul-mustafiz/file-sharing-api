jsonToArray = (jsonData) => {
  const array = Object.keys(jsonData).map((key) => [key, jsonData[key]]);
  return array;
};

module.exports = {
  jsonToArray,
};
