import { createContext, useContext } from "react";
import { useClientFetch, getAuthClientHeader } from "../hooks/useHttpRequest.js";
import { API_URL_CLIENT } from "../lib/const.js";
import { useNotification } from "./NotificationContext.jsx";

const ClientWishlistContext = createContext(null);

export const ClientWishlistProvider = ({ children }) => {
  const { notify } = useNotification();
  const { data: wishlistItemsData, refetch: refetchWishlistItem } = useClientFetch(`${API_URL_CLIENT}/customer/wishlist`);

  const addProductToWishList = async (product) => {

    const res = await fetch(`${API_URL_CLIENT}/customer/wishlist/${product.id}`, {
      method: 'POST',
      headers: getAuthClientHeader(),
      // body: JSON.stringify({}),
    });

    refetchWishlistItem();

    const resData = await res.json();

    if (res.status == 200) {
      notify(resData.message);
    } else {
      notify('produit non ajouter au wishlist')
    }
  }

  return (
    <ClientWishlistContext.Provider value={{ wishlistItemsData, addProductToWishList }}>
      {children}
    </ClientWishlistContext.Provider>
  );
};

export const useClientWishlist = () => useContext(ClientWishlistContext);
