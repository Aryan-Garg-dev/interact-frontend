import OrgSidebar from '@/components/common/org_sidebar';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React from 'react';

const OrgBase = () => {
  return (
    <BaseWrapper>
      <OrgSidebar index={-1} />
      <MainWrapper>
        <div></div>
      </MainWrapper>
      {/* <SideWrapper>
        <div></div>
      </SideWrapper> */}
    </BaseWrapper>
  );
};

export default OrgBase;
