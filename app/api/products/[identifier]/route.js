import ProductsManager from "@/server/products";

export async function GET(request, { params }) {
  const identifier = params?.identifier;

  if (!identifier) {
    return new Response("Provide product identifier.", {
      status: 403,
    });
  }

  const productsManager = new ProductsManager();
  const product = await productsManager.getProduct(identifier);
  return new Response(JSON.stringify(product), {
    status: 200,
  });
}

export async function PUT(request, { params }) {
  const updatedProduct = await request.json();
  const productsManager = new ProductsManager();
  const updateResult = await productsManager.updateProduct(updatedProduct);

  return new Response(updateResult, {
    status: 200,
  });
}

export async function DELETE(request, { params }) {
  const identifier = params?.identifier;

  if (!identifier) {
    return new Response("Provide product identifier.", {
      status: 403,
    });
  }
  const productsManager = new ProductsManager();
  const deleteResult = await productsManager.deleteProduct(params.identifier);

  return new Response(deleteResult, { status: 200 });
}

export async function POST(request) {
  const product = await request.json();
  const productsManager = new ProductsManager();
  const addResult = await productsManager.addProduct(product);

  return new Response(addResult, {
    status: 200,
  });
}
