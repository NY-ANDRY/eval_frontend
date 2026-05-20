import { createContext, useContext } from "react";
import { useClientFetch, getAuthClientHeader } from "../hooks/useHttpRequest.js";
import { API_URL_CLIENT } from "../lib/const.js";
import { useNotification } from "./NotificationContext.jsx";

const ClientWishlistContext = createContext(null);

export const ClientWishlistProvider = ({ children }) => {
  const { notify } = useNotification();
  const { data: wishlistItemsData, refetch: refetchWishlistItem } = useClientFetch(`${API_URL_CLIENT}/customer/wishlist`);

  const addProductToWishList = async (productId) => {

    const res = await fetch(`${API_URL_CLIENT}/customer/wishlist/${productId}`, {
      method: 'POST',
      headers: getAuthClientHeader(),
      // body: JSON.stringify({}),
    });

    refetchWishlistItem();

    const resData = await res.json();

    if (res.status == 200) {
      notify(resData.message, 3, "green");
    } else {
      notify('produit non ajouter au wishlist')
    }
  }

  const moveToCart = async (productId, qtt) => {
    const bodyy = {
      id: productId,
      quantity: qtt
    }

    const res = await fetch(`${API_URL_CLIENT}/customer/wishlist/${productId}/move-to-cart`, {
      method: 'POST',
      headers: getAuthClientHeader(),
      body: JSON.stringify(bodyy)
    });

    refetchWishlistItem();

    if (res.status == 200) {
      const resData = await res.json();
      notify(resData.message, 3, "green");
    } else {
      notify('produit not move to cart', 3, "red");
    }
  }

  return (
    <ClientWishlistContext.Provider value={{ wishlistItemsData, addProductToWishList, moveToCart }}>
      {children}
    </ClientWishlistContext.Provider>
  );
};

export const useClientWishlist = () => useContext(ClientWishlistContext);
