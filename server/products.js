// I think let's start with CRUD operations for single products
// that way I can then do those user stories with it

import DatabaseManager from "./database";

class ProductsManager {
  constructor(products) {
    this.products = products;
    this.databaseManager = new DatabaseManager();
    this.requiredProperties = [
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
  }
  isValid() {
    let anyProductMissingProps;
    this.products.forEach((product) => {
      const allRequiredPropertiesCheck = this.requiredProperties.every(
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

  isValidSingle(product) {
    let productMissingProps;
    const allRequiredPropertiesCheck = this.requiredProperties.every(
      (requiredProperty) => product.hasOwnProperty(requiredProperty)
    );

    if (!allRequiredPropertiesCheck) {
      productMissingProps = true;
    }

    if (productMissingProps) {
      return false;
    } else {
      return true;
    }
  }

  async getProduct(identifier) {
    const dbConnection = this.databaseManager.connect();

    try {
      const product = await new Promise((resolve, reject) => {
        dbConnection.query(
          `SELECT * FROM products WHERE identifier = ?`,
          [identifier],
          (error, results) => {
            const product = results[0];

            if (error) {
              reject(new Error(error));
            }

            if (product) {
              resolve(product);
            } else {
              reject(new Error("Product couldn't be found."));
            }
          }
        );
      });

      return product;
    } catch (error) {
      console.log(error);
      return error.toString();
    }
  }

  async updateProduct(updatedProduct) {
    const product = await this.getProduct(updatedProduct.identifier);

    if (product) {
      const validProduct = this.isValidSingle(updatedProduct);
      if (validProduct) {
        const dbConnection = this.databaseManager.connect();

        await new Promise((resolve, reject) => {
          dbConnection.query(
            `UPDATE products 
             SET name = ?, category = ?, price = ?, description = ?, images = ?, quantity = ?, rating = ?, reviewCount = ? 
             WHERE identifier = ?;`,
            [
              updatedProduct.name,
              updatedProduct.category,
              updatedProduct.price,
              updatedProduct.description,
              updatedProduct.images,
              updatedProduct.quantity,
              updatedProduct.rating,
              updatedProduct.reviewCount,
              updatedProduct.identifier,
            ],
            (error) => {
              if (!error) {
                resolve();
              } else {
                reject();
              }
            }
          );
        });

        return "Product was updated.";
      }
    } else {
      return "Product with this identifier doesn't exist.";
    }
  }
}

export default ProductsManager;
