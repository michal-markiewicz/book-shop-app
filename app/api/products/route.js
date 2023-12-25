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

  return new Response("Products updated.", {
    status: 200,
  });
}
