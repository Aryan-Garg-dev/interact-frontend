import { SERVER_ERROR } from '@/config/errors';
import { COMMUNITY_PROFILE_PIC_URL, EVENT_PIC_URL, EXPLORE_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import MentionList from './mention-list';
import { Community, User, Event, Opening, Project, Organization  } from "@/types"
import { visit } from 'yaml/dist/parse/cst-visit';
import { getProjectPicURL } from '@/utils/funcs/safe_extract';

export type MentionData = {
  usernameOrTitle: string,
  name?: string,
  id: string,
  profilePic: string,
  category: string,
  href?: string,
}

type FetchResponse = {
  communities: Community[],
  users: User[],
  events: Event[],
  orgs: Organization[],
  openings: Opening[],
  projects: Project[]
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  //TODO: pass query in props and make request in the comp
  items: ({ query }: { query: string }) => {
    const fetchUsers = async (search: string) => {
      const URL = `${EXPLORE_URL}/quick?search=${search}&limit=${10}`;
      const res = await getHandler(URL, undefined, true);
      if (res.statusCode == 200) {
        const data: FetchResponse = res.data;
        const response: MentionData[] = []
        for (const key of Object.keys(data) as (keyof FetchResponse)[]) {
          if (key == 'users') {
            response.push(...data[key].map((user) => ({
              usernameOrTitle: user.username,
              name: user.name,
              profilePic: `${USER_PROFILE_PIC_URL}/${user.profilePic}`,
              id: user.id,
              category: key,
              href: `/users/${user.username}`
            })));
          } else if (key == "communities") {
            response.push(...data[key].map(item => ({
              usernameOrTitle: item.title,
              id: item.id,
              profilePic: `${COMMUNITY_PROFILE_PIC_URL}/${item.profilePic}`,
              category: key,
              href: `/community/${item.id}`
            })));
          } else if (key == "events") {
            response.push(...data[key].map(item => ({
              usernameOrTitle: item.title,
              id: item.id,
              category: key,
              profilePic: `${EVENT_PIC_URL}/${item.coverPic}`,
              href: `/events/${item.id}`
            })))
          } else if (key == "orgs") {
            response.push(...data[key].map(item => ({
              usernameOrTitle: item.title,
              id: item.id,
              category: key,
              profilePic: `${USER_PROFILE_PIC_URL}/${item.user.profilePic}`,
              href: `/organisations/${item.user.username}`
            })))
          } else if (key == "projects"){
            response.push(...data[key].map(item => ({
              usernameOrTitle: item.title,
              id: item.id,
              category: key,
              profilePic: getProjectPicURL(item),
              href: `/projects/${item.slug}`
            })))
          } else if (key == "openings") {
            response.push(...data[key].map(item => ({
              usernameOrTitle: item.title,
              id: item.id,
              category: key,
              profilePic: getProjectPicURL(item.project)
            })));
          }
        }
        return response.sort((a, b)=> {
          if (a.usernameOrTitle.toLowerCase().startsWith(query.toLowerCase()) && !b.usernameOrTitle.toLowerCase().startsWith(query.toLowerCase())) return -1;
          if (!a.usernameOrTitle.toLowerCase().startsWith(query.toLowerCase()) && b.usernameOrTitle.toLowerCase().startsWith(query.toLowerCase())) return 1;
          return a.usernameOrTitle.localeCompare(b.usernameOrTitle);
        });
      } else {
        if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
        else Toaster.error(SERVER_ERROR, 'error_toaster');
        return [];
      }
    };
    return fetchUsers(query)
  },

  render: () => {
    let component: any
    let popup: any

    return {
      //TODO: IDEA: can pass query as prop and make request in the comp with useEffect
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: any) {
        //TODO: Throttling
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        if (popup[0]) popup[0].destroy()
        if (component) component.destroy()
      },
    }
  },
}