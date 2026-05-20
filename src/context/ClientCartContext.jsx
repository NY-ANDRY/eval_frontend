import { createContext, useContext, useState, useEffect } from "react";
import { useClientFetch, useClientMutation, getAuthHeaders } from "../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../lib/const";
import { useNotification } from "./NotificationContext";

const ClientCartContext = createContext(null);

export const ClientCartProvider = ({ children }) => {
  const { notify } = useNotification();
  const { data: cartItems, refetch: refetchCartItem } = useClientFetch(`${API_URL_CLIENT}/customer/cart`);
  const { mutate: mutateRemoveCart } = useClientMutation(`${API_URL_CLIENT}/customer/cart/remove`, 'DELETE');
  const { mutate: mutateUpdateCart } = useClientMutation(`${API_URL_CLIENT}/customer/cart/update`, 'PUT');

  const addProductToCart = async (productId, qtt) => {

    const bodyToSend = {
      'product_id': productId,
      'is_buy_now': 0,
      'quantity': qtt,
    };

    const res = await fetch(`${API_URL_CLIENT}/customer/cart/add/${productId}`, {
      method: 'POST',
      headers: getAuthHeaders("client"),
      body: JSON.stringify(bodyToSend),
    });

    refetchCartItem();

    const resData = await res.json();

    if (res.status == 200) {
      notify(`${resData.message}`, 3, "green")
    } else {
      notify(`${resData.message}`)
    }
  }

  const updateQtt = async (cartItem, qtt) => {
    const updateDataa = {
      qty: {
        [cartItem.id]: qtt
      }
    };
    await mutateUpdateCart(updateDataa);

    refetchCartItem();
    notify('produit mis a jour', 1, "green");
  };

  const removeCartItem = async (cartItem) => {
    const res = await fetch(`${API_URL_CLIENT}/customer/cart/remove/${cartItem.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    refetchCartItem();
    notify('row deleted');

  }

  const removeCart = async () => {
    await mutateRemoveCart();
    refetchCartItem();

    notify('remove cart');
  }

  return (
    <ClientCartContext.Provider value={{ cartItems, addProductToCart, updateQtt, removeCartItem, removeCart, refetchCartItem }}>
      {children}
    </ClientCartContext.Provider>
  );
};

export const useClientCart = () => useContext(ClientCartContext);
