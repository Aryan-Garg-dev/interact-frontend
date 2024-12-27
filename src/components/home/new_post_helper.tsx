import React from 'react';
import { Info } from '@phosphor-icons/react';
import Editor from '@/components/editor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
  smallScreen?: boolean;
}

const content =
  '<p><code>#</code> <code>##</code> <code>###</code> <mark>Headings</mark></p><p><strong>bold </strong><code>ctrl+b</code> <code>__bold__</code></p><p><em>italic </em><code>ctrl+i</code> <code>_italic_</code></p><p><u>undeline</u> <code>ctrl+u</code></p><p><a target="_blank" rel="noopener noreferrer nofollow" class="" href="https://interactnow.in/home">link</a> <code>ctrl+l</code> <mark>paste a link</mark></p><ul><li><p><code>- </code><mark>Unordered List</mark></p></li></ul><ol><li><p><code>1. </code><mark>Ordered List</mark></p></li></ol><blockquote><p><code>&gt; </code><mark>Quotes</mark></p></blockquote><p><span data-type="mention" class="mention" data-mention-id="f5958e3b-51bd-47db-bf2e-247bf789a6d4" data-mention-category="users" data-mention-label="johndoe" data-mention-href="/users/johndoe">@johndoe</span> <mark>mention</mark></p><p><code>==mark==</code> <mark>marks</mark></p><p><code>[]</code> <mark>task</mark></p><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Completed</p></div></li></ul><p><code>---</code> <mark>break</mark></p><hr><p><code>ctrl+z</code> <code>ctrl+y</code> <mark>undo &amp; redo</mark></p><p>and more….</p><p></p>';

const NewPostHelper = ({ smallScreen }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Info size={24} />
      </PopoverTrigger>
      <PopoverContent>
        <div className={`space-y-4 ${smallScreen ? 'text-xs' : 'text-sm'}`}>
          <div className="text-center font-medium">Make your post more interesting!</div>
          <Editor editable={false} content={content} className="w-full h-fit" />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NewPostHelper;
