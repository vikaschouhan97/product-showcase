import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import type { Product } from "./cards";

const openClassNames = {
  right: "translate-x-0",
  left: "translate-x-0",
  top: "translate-y-0",
  bottom: "translate-y-0",
};

const closeClassNames = {
  right: "translate-x-full",
  left: "-translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full",
};

const classNames = {
  right: "inset-y-0 right-0",
  left: "inset-y-0 left-0",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

const Drawer: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  side?: "right" | "left" | "top" | "bottom";
}> = ({ open, setOpen, side = "right" }) => {
  const [cartItems, setCartItems] = useState([]);

  const updateCartCount = () => {
    console.log("here");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const handleRemove = (product: Product) => {
    localStorage.setItem(
      "cart",
      JSON.stringify(
        cartItems?.filter((item: Product) => item.id !== product.id)
      )
    );
    window.dispatchEvent(new Event("cart-updated"));
  };
  return (
    <div
      id={`dialog-${side}`}
      className="relative z-10"
      aria-labelledby="slide-over"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(!open)}
    >
      <div
        className={clsx(
          "fixed !inset-0 bg-gray-400 !bg-opacity-75 transition-all",
          {
            "opacity-50 duration-500 ease-in-out visible": open,
          },
          { "opacity-0 duration-500 ease-in-out invisible": !open }
        )}
      ></div>
      <div className={clsx({ "fixed inset-0 overflow-hidden": open })}>
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={clsx(
              "pointer-events-none fixed max-w-full",
              classNames[side]
            )}
          >
            <div
              className={clsx(
                "pointer-events-auto relative w-full h-full transform transition ease-in-out duration-500",
                { [closeClassNames[side]]: !open },
                { [openClassNames[side]]: open }
              )}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <div
                className={clsx(
                  "flex flex-col justify-start h-full max-w-[400px] overflow-y-scroll bg-white p-4 overflow-x-hidden shadow-xl rounded-lg"
                )}
              >
                {cartItems.length > 0 ? (
                  cartItems.map((item: any) => (
                    <div key={item.id}>
                      <div className="flex gap-2 p-2 max-h-20 w-sm mb-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="min-w-16 max-h-16 max-w-16 h-full object-contain"
                        />
                        <div className="w-full">
                          <p
                            className="line-clamp-1 overflow-x-hidden"
                            title={item.title}
                          >
                            {item.title}
                          </p>
                          <p className="font-bold text-sm">
                            ${item.price * item.quantity}
                          </p>
                          <p className="text-xs text-gray-500 flex justify-between w-full mt-1 pr-3">
                            Quantity: {item.quantity}{" "}
                            <span
                              className="cursor-pointer hover:text-red-500"
                              onClick={() => handleRemove(item)}
                            >
                              Remove
                            </span>
                          </p>
                        </div>
                      </div>
                      <hr className="w-full" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 h-full flex justify-center items-center">
                    Your cart is empty, please add items.
                  </p>
                )}
                {cartItems?.length > 0 && (
                  <div className="px-4">
                    <p className="my-4 text-gray-500">
                      Total Amount: {" "}
                      <span className="font-bold text-black">
                        $
                        {cartItems
                          .reduce(
                            (acc, item: Product) =>
                              acc + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </p>
                    <div className="flex justify-between w-full">
                      <button
                        className="!text-white !bg-red-400"
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => setOpen(false)}
                        className="!text-white !bg-blue-400"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
