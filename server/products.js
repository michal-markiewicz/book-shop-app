// I think let's start with CRUD operations for single products
// that way I can then do those user stories with it

class ProductsManager {
  constructor(products) {
    this.products = products;
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
  getProduct(identifier) {}
}

export default ProductsManager;
