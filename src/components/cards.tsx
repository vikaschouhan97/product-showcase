import { ArrowRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type Product = {
  id: number;
  title: string;
  price: number;
  popularity: number;
  image: string;
  description: string;
  quantity: number;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
};

type SortBy = "price" | "popularity" | "name";

const ProductCards = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const PRODUCTS_PER_PAGE = 10;
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartProducts(cart);
  };

  const [sortBy, setSortBy] = useState<SortBy>("price");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        let categories: string[] = [];
        setCategories(categories);
        const enrichedProducts = data.map((product) => {
          if (!categories.includes(product.category)) {
            categories.push(product.category);
          }
          const cartItem = cart.find((item: Product) => item.id === product.id);
          return {
            ...product,
            quantity: cartItem ? cartItem.quantity : 0,
          };
        });
        setProducts(enrichedProducts);
        setCartProducts(cart); // keep in sync
      });
    window.addEventListener("cart-updated", updateCartCount);
    const randomUserId = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("userId", JSON.stringify(randomUserId));
    window.dispatchEvent(new Event("cart-updated"));
    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const updatedProducts = products.map((product) => {
      const cartItem = cartProducts.find((p) => p.id === product.id);
      return {
        ...product,
        quantity: cartItem ? cartItem.quantity : 0,
      };
    });
    setProducts(updatedProducts);
  }, [cartProducts]);

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
    setCartProducts(updatedCart);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "popularity":
          return b.rating.rate - a.rating.rate; // Assuming popularity = rating
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(
    filteredAndSortedProducts?.length / PRODUCTS_PER_PAGE
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="!text-xl font-semibold hidden md:block"></p>
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            className="border border-gray-300 rounded px-3 py-2 text-xs"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="price">Sort by Price</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="name">Sort by Name</option>
          </select>

          <select
            className="border border-gray-300 rounded px-3 py-2 text-xs"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
        {filteredAndSortedProducts
          .slice(
            (currentPage - 1) * PRODUCTS_PER_PAGE,
            currentPage * PRODUCTS_PER_PAGE
          )
          .map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white rounded-lg shadow-xl relative hover:transition-transform hover:scale-105"
            >
              <div className="p-2">
                <img
                  className="rounded-t-lg h-[180px] object-contain w-full"
                  src={product.image}
                  alt={product.title}
                />
              </div>
              <div className="p-6">
                <a href="">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 line-clamp-1">
                    {product.title}
                  </h5>
                </a>
                <p className="mb-1 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                  {product.description}
                </p>
                <p className="text-xl font-semibold">${product.price}</p>
                <div className="flex mt-3 flex-wrap justify-between">
                  <a
                    href=""
                    className="inline-flex items-center px-3 py-2 text-xs font-medium text-center !text-white bg-blue-400 rounded-lg"
                  >
                    Details
                    <ArrowRight size={16} className="ml-1" />
                  </a>
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
                  {product.quantity === 0 && (
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
          ))}
        <div className="fixed bottom-0 right-2 bg-white p-2 w-full mt-4 text-center">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="rounded-md !bg-blue-400 !text-white border border-slate-300 !py-1 px-3 text-center text-xs transition-all shadow-sm hover:shadow-lg hover:!bg-blue-800 hover:border-slate-800 disabled:opacity-50 ml-2"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`min-w-9 rounded-md !py-1 px-3 text-center text-xs transition-all ml-2 ${
                currentPage === i + 1
                  ? "!bg-blue-800 text-white"
                  : "!bg-blue-400 text-white hover:!bg-blue-800"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="rounded-md !bg-blue-400 !text-white border border-slate-300 !py-1 px-3 text-center text-xs transition-all shadow-sm hover:shadow-lg hover:!bg-blue-800 hover:border-slate-800 disabled:opacity-50 ml-2"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCards;
