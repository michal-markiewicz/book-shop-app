// I think let's start with CRUD operations for single products
// that way I can then do those user stories with it

import DatabaseManager from "./database";

class ProductsManager {
  constructor(products) {
    this.products = products;
    this.databaseManager = new DatabaseManager();
  }
  isValid() {
    const requiredProperties = [
      "identifier",
      "name",
      "category",
      "price",
      "description",
      "images",
      "quantity",
      "rating",
      "reviewCount",
    ];

    let anyProductMissingProps = false;
    this.products.forEach((product) => {
      const allRequiredPropertiesCheck = requiredProperties.every(
        (requiredProperty) => product.hasOwnProperty(requiredProperty)
      );

      if (!allRequiredPropertiesCheck) {
        anyProductMissingProps = true;
      }
    });

    if (anyProductMissingProps) {
      return false;
    } else {
      return true;
    }
  }

  async getProduct(identifier) {
    const dbConnection = this.databaseManager.connect();

    let product;
    await new Promise((resolve, reject) => {
      dbConnection.query(
        `SELECT * FROM products WHERE identifier = ${identifier}`,
        (error, results) => {
          product = results[0];

          if (product) {
            resolve();
          }

          if (error) {
            reject();
          }
        }
      );
    });

    return product;
  }
}

export default ProductsManager;
