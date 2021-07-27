import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/images/logo.svg";
import { SignInButton } from "../SignInButton";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src={logo} alt="ig.news" />
        <nav>
          <Link href="/">
            <a href="" className={styles.active}>
              Home
            </a>
          </Link>
          <Link href="/posts">
            <a className={styles.active}>Posts</a>
          </Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
