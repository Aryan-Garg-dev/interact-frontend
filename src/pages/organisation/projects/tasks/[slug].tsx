import BaseWrapper from '@/wrappers/base';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import OrgSidebar from '@/components/common/org_sidebar';
import OrgMembersOnlyAndProtect from '@/utils/wrappers/org_members_only';
import ProjectTasks from '@/screens/project_tasks';

interface Props {
  slug: string;
}

const Tasks = ({ slug }: Props) => {
  return (
    <BaseWrapper title="Tasks">
      <OrgSidebar index={3} />
      <ProjectTasks slug={slug} org={true} />
    </BaseWrapper>
  );
};

export default OrgMembersOnlyAndProtect(Tasks);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug } = context.query;

  return {
    props: { slug },
  };
}
