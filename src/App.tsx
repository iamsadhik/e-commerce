import { Routes, Route } from 'react-router-dom';
import { useCallback } from 'react';
import { Navbar, ErrorScreen } from './components';
import { ProductListingPage } from './pages/ProductListingPage/ProductListingPage';
import { CartPage } from './pages/CartPage/CartPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage/PaymentSuccessPage';
import { usePersistantState, useProducts } from './hooks';
import type { CartItem } from './types';

function App() {
  const { products, loading, error } = useProducts();
  const [cartItems, setCartItems] = usePersistantState<CartItem[]>('teestore-cart', []);

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev: CartItem[]) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        if (existing.quantity >= product.quantity) return prev;
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems((prev: CartItem[]) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev: CartItem[]) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  if (error) {
    return (
      <>
        <Navbar cartItems={cartItems} />
        <ErrorScreen message={error} />
      </>
    );
  }

  return (
    <>
      <Navbar cartItems={cartItems} />
      <Routes>
        <Route
          path="/"
          element={
            <ProductListingPage products={products} loading={loading} cartItems={cartItems} onAddToCart={handleAddToCart} />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              products={products}
              loading={loading}
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          }
        />
        <Route
          path="/payment-success"
          element={
            <PaymentSuccessPage onClearCart={handleClearCart} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
