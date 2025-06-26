import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./navbar";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  rating: {
    rate: number;
    count: number;
  };
};

const ProductDetails = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id || 1}`) // fallback to id 1
      .then((res) => res.json())
      .then((data: Product) => {
        const cart = localStorage.getItem("cart") || "[]";
        const parsedCart: Product[] = JSON.parse(cart);
        const productInCart = parsedCart.find((item) => item.id === data.id);
        if (productInCart) {
          data.quantity = productInCart.quantity;
        } else {
          data.quantity = 0;
        }
        setProduct(data);
      });
  }, [id]);

  const handleAddToCart = (
    e: React.MouseEvent,
    product: Product,
    method = "add"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = localStorage.getItem("cart") || "[]";
    const parsedCart: Product[] = JSON.parse(cart);
    let matched = false;

    const updatedCart = parsedCart.map((item) => {
      if (item.id === product.id) {
        matched = true;
        return {
          ...item,
          quantity: method === "add" ? item.quantity + 1 : item.quantity - 1,
        };
      }
      return item;
    });

    if (!matched) {
      updatedCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart?.filter((item) => item.quantity > 0))
    );
    window.dispatchEvent(new Event("cart-updated"));
    setProduct({
      ...product,
      quantity: method === "add" ? product.quantity + 1 : product.quantity - 1,
    });
  };

  return (
    <div className="min-h-screen min-w-screen text-gray-800 bg-blue-100">
      <Navbar />
      {product && (
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div
            onClick={() => navigate(-1)}
            className="flex mb-4 items-center px-4 gap-3 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Left: Product Image */}
            <div className="w-full md:w-1/2">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-contain bg-white p-4 max-h-[500px] rounded-lg border"
              />
            </div>

            {/* Right: Product Info */}
            <div className="w-full md:w-1/2">
              <p className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </p>

              <p className="text-gray-700 text-base mb-4">
                {product.description}
              </p>

              <p className="text-2xl font-semibold text-blue-600 mb-4">
                ${product.price}
              </p>

              <div className="flex items-center space-x-2 text-yellow-500 mb-2">
                <span className="text-lg font-medium">
                  ⭐ {product.rating.rate}
                </span>
                <span className="text-sm text-gray-500">
                  ({product.rating.count} reviews)
                </span>
              </div>

              {product.quantity > 0 && (
                <div className="flex ">
                  <button
                    className="!text-white !bg-blue-400 !rounded-none !rounded-l-lg p-0"
                    onClick={(e) => handleAddToCart(e, product, "remove")}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="inline-flex items-center px-3 py-2 text-xs font-small text-center !text-white bg-red-400">
                    {product.quantity}
                  </span>
                  <button
                    className="!text-white !bg-blue-400 !rounded-r-lg !rounded-none "
                    onClick={(e) => handleAddToCart(e, product, "add")}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              )}
              {product?.quantity === 0 && (
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="inline-flex hover:cursor-pointer items-center px-3 py-2 !text-xs font-medium text-center !text-white !bg-blue-400 rounded-lg"
                >
                  Add to cart
                  <ShoppingCart size={16} className="ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {!product && (
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      )}
    </div>
  );
};

export default ProductDetails;
