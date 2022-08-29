import {getSession, signOut, useSession} from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import {poll} from "./api/strapi/strapi";

export default function Home({polls}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session == null) return;
    console.log('session.jwt', session.jwt);
  }, [session]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Poll</title>
      </Head>
      <h1 className={styles.title}>
        Liste des sondages :
      </h1>
      <main className={styles.main}>
        <ul className={styles.list}>
          {polls.map(poll => (
            <li key={poll.id} className={styles.item}>
              <Link href={`/poll/${poll.id}`}>
                <a className={styles.link}>
                  {poll.attributes.Titre}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>

  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session == null) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: true,
      },
    };
  }
  const polls = await poll.all();
  console.log('polls', polls.data);
  return {
    props: {
      polls : polls.data
    },
  };
};
