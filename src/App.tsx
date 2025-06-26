import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProductDetails from "./components/productDetails";
import ProductCardsPage from "./content/productCardsPage";

const App: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<ProductCardsPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
    </Routes>
  );
};

export default App;
