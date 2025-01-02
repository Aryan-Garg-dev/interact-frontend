import { useCallback, useEffect, useState } from 'react';

const debounce = (func: (text: string)=>void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (text: string)=>{
    clearTimeout(timer);
    timer = setTimeout(()=>func(text), delay);
  };
}

export const useLocalDraft = (key: string, initialValue: string = '', delay = 500)=>{
  const [draft, setDraft] = useState(()=>{
    const savedDraft = localStorage.getItem(key);
    return savedDraft || initialValue;
  })

  const saveDraft = useCallback(
    debounce((value)=>{
      localStorage.setItem(key, value);
    }, delay), [key, delay]
  );

  useEffect(() => {
    saveDraft(draft);
  }, [draft, saveDraft]);


  return {draft, setDraft};
}