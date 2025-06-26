import Navbar from "../components/navbar";
import ProductCards from "../components/cards";

const ProductCardsPage = () => {
  return (
    <div className="min-h-screen min-w-screen text-gray-800 bg-blue-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-2 py-6">
        <ProductCards />
      </div>
    </div>
  );
};

export default ProductCardsPage;
