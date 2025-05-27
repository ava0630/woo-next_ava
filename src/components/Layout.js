import Head from "next/head";
import { AppProvider } from "./context/AppContext";
import Header from "./Header";
import Footer from "./Footer";
import client from "./ApolloClient";
import Router from "next/router";
import NProgress from "nprogress";
import { ApolloProvider } from "@apollo/client";
import { useRouter } from 'next/router';

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const Layout = (props) => {
  const router = useRouter();
  const isProductPage = router.pathname.includes('/product/');

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
