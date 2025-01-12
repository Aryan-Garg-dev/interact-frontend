import {
  ORG_MANAGER,
  ORG_MEMBER,
  ORG_SENIOR,
  PROJECT_EDITOR,
  PROJECT_MANAGER,
  PROJECT_MEMBER,
  PROJECT_OWNER,
} from '@/config/constants';
import { store } from '@/store';
import { Organization, PermissionConfig, Project } from '@/types';
import { initialOrganization, initialOrganizationMembership } from '@/types/initials';

const user = store.getState().user;
const org = store.getState().organization.currentOrg || initialOrganization;
const membership = store.getState().organization.currentOrgMembership || initialOrganizationMembership;

const checkOrgAccess = (accessRole: string, orgID?: string) => {
  if (org.id == '') return false;

  if (user.id == org.userID) return true;
  if (membership.id == '' || org.id != membership.organizationID) return false;

  if (orgID && orgID != org.id) return false;

  switch (accessRole) {
    case ORG_MANAGER:
      return membership.role == ORG_MANAGER;
    case ORG_SENIOR:
      return membership.role == ORG_MANAGER || membership.role == ORG_SENIOR;
    case ORG_MEMBER:
      return true;
    default:
      return false;
  }
};

export const checkOrgAccessByOrgUserID = (accessRole: string, orgUserID: string) => {
  if (org.id == '') return false;

  if (user.id == org.userID) return true;
  if (membership.id == '' || org.id != membership.organizationID) return false;

  if (orgUserID != org.userID) return false;

  switch (accessRole) {
    case ORG_MANAGER:
      return membership.role == ORG_MANAGER;
    case ORG_SENIOR:
      return membership.role == ORG_MANAGER || membership.role == ORG_SENIOR;
    case ORG_MEMBER:
      return true;
    default:
      return false;
  }
};

export const checkParticularOrgAccess = (accessRole: string, checkOrg: Organization | null) => {
  if (!checkOrg) return false;
  if (checkOrg.id == '') return false;

  if (user.id == checkOrg.userID) return true;

  const memberships = user.organizationMemberships;

  var checkerMembership = initialOrganizationMembership;

  memberships.forEach(m => {
    if (m.organizationID == checkOrg.id) checkerMembership = m;
  });

  if (checkerMembership.id == '') return false;

  switch (accessRole) {
    case ORG_MANAGER:
      return checkerMembership.role == ORG_MANAGER;
    case ORG_SENIOR:
      return checkerMembership.role == ORG_MANAGER || checkerMembership.role == ORG_SENIOR;
    case ORG_MEMBER:
      return true;
    default:
      return false;
  }
};

export const checkProjectAccess = (role: string, projectID?: string, project?: Project) => {
  const ownerProjects = user.ownerProjects;
  const managerProjects = user.managerProjects;
  const editorProjects = user.editorProjects;
  const memberProjects = user.memberProjects;

  if (!projectID) return false;

  const isOwner = ownerProjects.includes(projectID) || project?.userID == user.id;
  const isManager = managerProjects.includes(projectID);
  const isEditor = editorProjects.includes(projectID);
  const isMember = memberProjects.includes(projectID);

  switch (role) {
    case PROJECT_OWNER:
      return isOwner;
    case PROJECT_MANAGER:
      return isOwner || isManager;
    case PROJECT_EDITOR:
      return isOwner || isManager || isEditor;
    case PROJECT_MEMBER:
      return isOwner || isManager || isEditor || isMember;
    default:
      return false;
  }
};

//TODO take orgID from project
export const checkOrgProjectAccess = (
  projectRole: string,
  projectID: string,
  orgRole: string,
  org?: Organization | null,
  isOrgProject: boolean = false
) => {
  const projectAccess = checkProjectAccess(projectRole, projectID);
  const orgAccess = org ? checkParticularOrgAccess(orgRole, org) : isOrgProject ? checkOrgAccess(orgRole) : false;

  return projectAccess || orgAccess;
};

export const checkCommunityAccess = (communityID: string, action: string, config?: PermissionConfig) => {
  const membership = user.communityMemberships?.filter(m => m.communityID == communityID)[0];

  if (membership) {
    const requiredRole = config ? config[action] : undefined;

    if (!requiredRole) return false;

    return compareRoleLevel(membership.role, requiredRole);
  }

  return false;
};

export const checkCommunityStaticAccess = (communityID: string, requiredRole: string) => {
  const membership = user.communityMemberships?.filter(m => m.communityID == communityID)[0];

  if (membership) return compareRoleLevel(membership.role, requiredRole);
  return false;
};

function compareRoleLevel(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: { [key: string]: number } = {
    member: 0,
    moderator: 1,
    senior: 1,
    editor: 1,
    admin: 2,
    manager: 2,
    owner: 3,
  };

  return roleHierarchy[userRole.toLowerCase()] >= roleHierarchy[requiredRole.toLowerCase()];
}

export default checkOrgAccess;
