

const findProductsBy = (reqQuery, dbEntry) => {
     const userInput = reqQuery;
     if (userInput) {
       productQuery = productQuery.find({
         dbEntry: { $regex: userInput, $options: 'i' },
       });
     }
}

export default findProductsBy;