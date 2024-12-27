import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import Image from 'next/image';
import { MentionData } from '@/components/editor/mentions/mention-suggestions';

type MentionNodeData = {
  id: string,
  category: string,
  label: string,
  href: string
}

type MentionListProps = {
  items: MentionData[]
  command: (item: MentionNodeData) => void
}

export type MentionListHandle = {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean 
}

const MentionList = forwardRef<MentionListHandle, MentionListProps>((props, ref) => {
  const user = useSelector(userSelector); 

  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command({
        id: item.id,
        category: item.category,
        label: item.usernameOrTitle,
        href: item.href || '#'
      })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => {
    setSelectedIndex(0)
  }, [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="dropdown-menu  max-w-[300px]">
      {props.items.length && props.items[0].id != user.id ? (
        props.items.slice(0, 10).map((item, index) => item.id != user.id && (
          <button
            className={`flex justify-between items-center overflow-x-hidden min-w-fit ${index === selectedIndex ? 'bg-neutral-300 dark:bg-neutral-700' : ''}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex gap-2.5">
              <Image
                alt={'User Pic'}
                src={item.profilePic}
                className="w-6 h-6 rounded-full"
                width={32}
                height={32}
              />
              <p className="text-sm text-ellipsis">{item.usernameOrTitle}</p>
            </div>
            {item.name && <p className="text-xs text-balance text-neutral-600">{item.name}</p>}
          </button>
        ))
      ) : (
        <div className="text-sm truncate text-nowrap min-w-52 text-neutral-600">No result</div>
      )}
    </div>
  )
})

export default MentionList;
