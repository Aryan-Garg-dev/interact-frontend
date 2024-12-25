import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { User } from '@/types';
import Toaster from '@/utils/toaster';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import MentionList from './mention-list';

export default {
  items: ({ query }: { query: string }) => {
    const fetchUsers = async (search: string) => {
      const URL = `${EXPLORE_URL}/users?search=${search}&order=trending&limit=${10}&include=org`;
      const res = await getHandler(URL, undefined, true);
      if (res.statusCode == 200) {
        const userData: User[] = res.data.users || [];
        return userData.map(user => ({ name: user.name, username: user.username, image: user.profilePic, id: user.id }))
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
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}