import React from 'react';
import nookies from 'nookies';
import { GetServerSidePropsContext } from 'next/types';

const Index = () => {
  return <></>;
};

export default Index;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const token = nookies.get(context).token;
  if (!token) {
    return {
      redirect: {
        permanent: true,
        destination: '/login',
      },
      props: {},
    };
  }
  return {
    redirect: {
      permanent: true,
      destination: '/home',
    },
    props: { token },
  };
};
