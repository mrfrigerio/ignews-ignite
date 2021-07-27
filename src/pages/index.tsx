import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import codingGirlImg from "../../public/images/avatar.svg";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

interface IHomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: IHomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about <br />
            the <span>React</span> world.
          </h1>
          <p>
            Get access to all publications
            <br />
            <span>for {product.amount}/month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image src={codingGirlImg} alt="Coding girl" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(
    process.env.STRIPE_PRODUCT_PRICE!,
    {
      expand: ["product"],
    }
  );

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price.unit_amount! / 100),
  };

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
