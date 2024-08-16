import React from 'react';
import { GetServerSidePropsContext } from 'next/types';

const Index = () => {
  return <></>;
};

export default Index;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    redirect: {
      permanent: true,
      destination: '/home',
    },
    props: {},
  };
};
