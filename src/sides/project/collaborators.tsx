import UserSideCard from '@/components/explore/user_side_card';
import { ORG_MANAGER, PROJECT_MANAGER } from '@/config/constants';
import ManageMemberships from '@/sections/workspace/manage_memberships';
import AddCollaborators from '@/sections/workspace/manage_project/add_collaborators';
import { Project } from '@/types';
import checkOrgAccess, { checkProjectAccess } from '@/utils/funcs/access';
import { SidePrimeWrapper } from '@/wrappers/side';
import React, { useMemo } from 'react';

const Collaborators = ({
  project,
  setProject,
}: {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
}) => {
  const isAllowed = useMemo(() => {
    const projectAccess = checkProjectAccess(PROJECT_MANAGER, project.id);
    const orgAccess = !!(
      project.organizationID &&
      project.organizationID !== '' &&
      checkOrgAccess(ORG_MANAGER, project.organizationID)
    );

    return projectAccess || orgAccess;
  }, [project]);
  return (project.memberships && project.memberships.length > 0) || isAllowed ? (
    <SidePrimeWrapper>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center justify-between">
          <div className="text-lg font-medium">Collaborators</div>
          {isAllowed && (
            <div className="flex-center gap-2">
              <AddCollaborators
                project={project}
                setProject={setProject}
                org={
                  !!(
                    project.organizationID &&
                    project.organizationID !== '' &&
                    checkOrgAccess(ORG_MANAGER, project.organizationID)
                  )
                }
              />
              {(project.memberships.length > 0 || project.invitations.length > 0) && (
                <ManageMemberships
                  project={project}
                  setProject={setProject}
                  org={
                    !!(
                      project.organizationID &&
                      project.organizationID !== '' &&
                      checkOrgAccess(ORG_MANAGER, project.organizationID)
                    )
                  }
                />
              )}
            </div>
          )}
        </div>
        {project.memberships.map(membership => (
          <UserSideCard key={membership.id} user={membership.user} />
        ))}
      </div>
    </SidePrimeWrapper>
  ) : (
    <></>
  );
};

export default Collaborators;
