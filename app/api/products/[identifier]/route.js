import ProductsManager from "@/server/products";

export async function GET(request, { params }) {
  const identifier = params?.identifier;

  if (!identifier) {
    return new Response("Provide product identifier plz.", {
      status: 403,
    });
  }

  const productsManager = new ProductsManager();
  const product = await productsManager.getProduct(identifier);
  return new Response(JSON.stringify(product), {
    status: 200,
  });
}
