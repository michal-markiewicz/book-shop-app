import ProductsManager from "@/server/products";
import Products from "@/server/products";
import * as mysql from "mysql";

export async function POST(request) {
  const products = await request.json();
  const productsManager = new ProductsManager(products);
  const validProducts = productsManager.isValid();

  if (!validProducts) {
    return new Response("Products are not valid.", {
      status: 403,
    });
  }

  const result = await productsManager.addAllProducts(products);

  return new Response(result, {
    status: 200,
  });
}

export async function DELETE() {
  const productsManager = new ProductsManager();
  const result = await productsManager.deleteAllProducts();

  return new Response(result, { status: 200 });
}

export async function GET() {
  const productsManager = new ProductsManager();
  const result = await productsManager.getAllProducts();

  return new Response(JSON.stringify(result), { status: 200 });
}
