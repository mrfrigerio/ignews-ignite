import type { AppProps } from "next/app";
import "../styles/global.scss";
import { Header } from "../components/Header";
import { Provider as NextAuthProvider } from "next-auth/client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}
export default MyApp;
