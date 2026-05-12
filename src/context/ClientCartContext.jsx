import { createContext, useContext, useState, useEffect } from "react";
import { useFetch, useMutation, getAuthHeaders } from "../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../lib/const";
import { useNotification } from "./NotificationContext";

const ClientCartContext = createContext(null);

export const ClientCartProvider = ({ children }) => {
  const { notify } = useNotification();
  const { data: cartItems, refetch: refetchCartItem } = useFetch(`${API_URL_CLIENT}/customer/cart`);
  const { mutate: mutateRemoveCart } = useMutation(`${API_URL_CLIENT}/customer/cart/remove`, 'DELETE');
  const { mutate: mutateUpdateCart } = useMutation(`${API_URL_CLIENT}/customer/cart/update`, 'PUT');

  const addProductToCart = async (product, qtt) => {

    const bodyToSend = {
      'product_id': product.id,
      'is_buy_now': 0,
      'quantity': qtt,
    };

    const res = await fetch(`${API_URL_CLIENT}/customer/cart/add/${product.id}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bodyToSend),
    });

    refetchCartItem();

    if (res.status == 200) {
      notify('produit ajouter au panier')
    } else {
      notify('produit non ajouter au panier')
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
    notify('produit mis a jour', 1);
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
    <ClientCartContext.Provider value={{ cartItems, addProductToCart, updateQtt, removeCartItem, removeCart }}>
      {children}
    </ClientCartContext.Provider>
  );
};

export const useClientCart = () => useContext(ClientCartContext);
