import DatabaseManager from "./database";

interface Product {
  identifier: string;
  name: string;
  category: string;
  price: string;
  description: string;
  images: string;
  quantity: string;
  rating: string;
  reviewCount: string;
}

interface IProductsManager {
  isValid(): boolean;
  isValidSingle(product: Product): boolean;
  getProduct(identifier: string): Promise<Product | string>;
  updateProduct(updatedProduct: Product): Promise<string>;
  deleteProduct(identifier: string): Promise<string>;
  deleteAllProducts(): Promise<string>;
  addProduct(product: Product): Promise<string>;
  addAllProducts(products: Product[]): Promise<string>;
  getAllProducts(): Promise<Product[] | string>;
}

class ProductsManager implements IProductsManager {
  products: any;
  databaseManager: any;
  requiredProperties: string[];

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

  async getAllProducts() {
    try {
      const dbConnection = this.databaseManager.createConnection();
      const result = await new Promise((resolve, reject) => {
        dbConnection.query(`SELECT * FROM products`, (error, results) => {
          if (error) {
            reject(new Error(error));
          }

          if (results) {
            resolve(results);
          } else {
            reject(new Error("Product couldn't be found."));
          }
        });
      });

      return result;
    } catch (error) {
      console.log(error);
      return error.toString();
    }
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
    const dbConnection = this.databaseManager.createConnection();

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
    const isValid = this.isValidSingle(updatedProduct);
    const product = await this.getProduct(updatedProduct.identifier);

    if (!isValid) {
      return "Product is not valid.";
    }

    if (!product) {
      return "Couldn't find product with this identifier.";
    }

    const dbConnection = this.databaseManager.createConnection();

    try {
      const result = await new Promise((resolve, reject) => {
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
              resolve("Product was updated");
            } else {
              console.log(new Error(error));
              reject(error);
            }
          }
        );
      });

      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(identifier) {
    const product = await this.getProduct(identifier);

    if (!product) {
      return "Product with this identifier doesn't exist.";
    }

    const dbConnection = this.databaseManager.createConnection();

    try {
      const result = await new Promise((resolve, reject) => {
        dbConnection.query(
          "DELETE FROM products WHERE identifier = ?",
          [identifier],
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve("Product was removed.");
            }
          }
        );
      });

      return result;
    } catch (error) {
      console.error(new Error(error));
      return error;
    }
  }

  async deleteAllProducts() {
    try {
      const dbConnection = this.databaseManager.createConnection();

      const result = await new Promise((resolve, reject) => {
        dbConnection.query("DELETE FROM products", (error) => {
          if (error) {
            reject(error);
          } else {
            resolve("Products removed.");
          }
        });
      });

      return result;
    } catch (error) {
      console.error(new Error(error));
      return error;
    }
  }

  async addAllProducts(products) {
    let result;

    for (const product of products) {
      const addProductResult = await this.addProduct(product);

      if (addProductResult !== "Product added to the database.") {
        result = "Something went wrong.";
      }
    }

    if (!result) {
      result = "Products added to the database";
    }

    return result;
  }

  async addProduct(product) {
    const isValid = this.isValidSingle(product);

    console.log(product);

    if (!isValid) {
      return "This product is not valid.";
    }

    try {
      const dbConnection = this.databaseManager.createConnection();
      const result = await new Promise((resolve, reject) => {
        dbConnection.query(
          `INSERT INTO products (identifier, name, category, price,
                description, images, quantity, rating, reviewCount) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.identifier,
            product.name,
            product.category,
            product.price,
            product.description,
            product.images,
            product.quantity,
            product.rating,
            product.reviewCount,
          ],
          (error) => {
            if (!error) {
              resolve("Product added to the database.");
            } else {
              console.error(new Error(error));
              reject(error);
            }
          }
        );
      });
      return result;
    } catch (error) {
      console.error(new Error(error));
      return error;
    }
  }
}

export default ProductsManager;
