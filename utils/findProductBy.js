

// const findProductsBy = (reqQuery, dbEntry) => {
//      const userInput = reqQuery;
//      if (userInput) {
//        productQuery = productQuery.find({
//          [dbEntry]: { $regex: userInput, $options: 'i' },
//        });
//      }
// }

const findProductsBy = (query, value, field) => {
  if (value) {
    query = query.find({
      [field]: { $regex: value, $options: 'i' },
    });
  }
  return query;
}

export default findProductsBy;