import { useEffect } from "react";
import Head from "next/head";
import { AppProvider } from "./context/AppContext";
import Header from "./Header";
import Footer from "./Footer";
import client from "./ApolloClient";
import { useRouter } from 'next/router';
import NProgress from "nprogress";
import { ApolloProvider } from "@apollo/client";

const Layout = (props) => {
  const router = useRouter();
  const isProductPage = router.pathname.includes('/product/');

  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, [router.events]);

  return (
    <AppProvider>
      <ApolloProvider client={client}>
        <div>
          <Head>
            <title>Woocommerce React Theme</title>
          </Head>
          <Header />
          <div className={`content-wrapper ${!isProductPage ? 'pt-24' : ''}`}>
            {props.children}
          </div>
          <Footer />
        </div>
      </ApolloProvider>
    </AppProvider>
  );
};

export default Layout;
