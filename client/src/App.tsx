import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/ui/page-transition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/not-found";
import Category from "@/pages/Category";
import BulkOrder from "@/pages/BulkOrder";

function Router() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/">
              <PageTransition key="home">
                <Home />
              </PageTransition>
            </Route>
            <Route path="/category/:id">
              <PageTransition key="category">
                <Category />
              </PageTransition>
            </Route>
            <Route path="/product/:id">
              <PageTransition key="product">
                <Product />
              </PageTransition>
            </Route>
            <Route path="/cart">
              <PageTransition key="cart">
                <Cart />
              </PageTransition>
            </Route>
            <Route path="/checkout">
              <PageTransition key="checkout">
                <Checkout />
              </PageTransition>
            </Route>
            <Route path="/bulk-order">
              <PageTransition key="bulk-order">
                <BulkOrder />
              </PageTransition>
            </Route>
            <Route>
              <PageTransition key="not-found">
                <NotFound />
              </PageTransition>
            </Route>
          </Switch>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;