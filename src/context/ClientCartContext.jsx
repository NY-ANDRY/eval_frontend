import { createContext, useContext, useState, useEffect } from "react";
import { useFetch, useMutation, getAuthHeaders } from "../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../lib/const";
import { useNotification } from "./NotificationContext";

const ClientCartContext = createContext(null);

export const ClientCartProvider = ({ children }) => {
  const { notify } = useNotification();
  const { data: cartItems, refetch: refetchCartItem } = useFetch(`${API_URL_CLIENT}/customer/cart`);

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

  const updateQtt = (product, qtt) => {

  }

  const removeProduct = (product) => {

  }

  return (
    <ClientCartContext.Provider value={{ cartItems, addProductToCart }}>
      {children}
    </ClientCartContext.Provider>
  );
};

export const useClientCart = () => useContext(ClientCartContext);
