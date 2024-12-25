import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import { USER_PROFILE_PIC_URL } from '@/config/routes';

type MentionListProps = {
  items: {
    username: string, 
    name: string,
    id: string,
    image: string
  }[] 
  command: (item: { id: string }) => void 
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
      props.command({ id: item.username })
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
    <div className="dropdown-menu w-52">
      {props.items.length && props.items[0].id != user.id ? (
        props.items.map((item, index) => item.id != user.id && (
          <button
            className={`flex justify-between items-center ${index === selectedIndex ? 'bg-neutral-300 dark:bg-neutral-700' : ''}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex gap-2.5">
              <img 
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                className="w-6 h-6 rounded-full" 
              />
              <p className="text-sm truncate">{item.name}</p>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-00">{item.username}</p>
          </button>
        ))
      ) : (
        <div className="text-sm">No result</div>
      )}
    </div>
  )
})

export default MentionList;
