import Sidebar from '@/components/common/sidebar';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React from 'react';

const Base = () => {
  return (
    <BaseWrapper>
      <Sidebar index={-1} />
      <MainWrapper>
        <div></div>
      </MainWrapper>
      {/* <SideWrapper>
        <div></div>
      </SideWrapper> */}
    </BaseWrapper>
  );
};

export default Base;
