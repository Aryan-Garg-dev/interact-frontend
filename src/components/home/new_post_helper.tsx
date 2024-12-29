import React from 'react';
import { Info } from '@phosphor-icons/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
  smallScreen?: boolean;
}

const NewPostHelper = ({ smallScreen }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Info size={24} />
      </PopoverTrigger>
      <PopoverContent className="w-[420px] max-h-[520px] overflow-y-auto thin_scrollbar shadow-lg dark:shadow-neutral-900">
        <div className={`space-y-4 ${smallScreen ? 'text-xs' : 'text-sm'}`}>
          <div className="text-center font-medium">Tips to make your post more interesting!</div>
          <div className="w-full h-fit rounded-md grid grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="font-semibold mb-2 underline underline-offset-2">Headings</h2>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">#</code> → H1
                </p>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">##</code> → H2
                </p>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">###</code> → H3
                </p>
              </div>
              <div className="space-y-1">
                <h2 className="font-semibold mb-2 underline underline-offset-2">Lists</h2>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">-</code> → Bullet list
                </p>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">1.</code> → Numbered list
                </p>
              </div>
              <div className="space-y-1">
                <h2 className="font-semibold mb-2 underline underline-offset-2">Extras</h2>
                <div className="flex items-center gap-1">
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">&gt;</code> →{' '}
                  <div className="w-fit px-1 rounded-md border-dotted border-[1px] border-black dark:border-white">
                    Quote
                  </div>
                </div>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">@search</code> → Mention
                </p>
                <div className="flex items-center gap-1">
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">==mark==</code> →{' '}
                  <div className="w-fit px-1 bg-primary_text rounded-md">Highlight</div>
                </div>
                <div className="flex items-center gap-1">
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">[ ]</code> →{' '}
                  <div className="flex-center gap-1">
                    <input type="checkbox" />
                    <div>Checkbox</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="font-semibold mb-2 underline underline-offset-2">Formatting</h2>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">ctrl+b</code> /{' '}
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">__bold__</code> → <strong>Bold</strong>
                </p>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">ctrl+i</code> {' / '}
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">_italic_</code> → <i>Italic</i>
                </p>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">ctrl+u</code> → <u>Underline</u>
                </p>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">ctrl+l</code> →{' '}
                  <a href="#" className="text-blue-500 underline">
                    Link
                  </a>
                </p>
              </div>

              <div className="space-y-1">
                <h2 className="font-semibold mb-2 underline underline-offset-2">Other Actions</h2>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">---</code> → Divider
                </p>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">ctrl+z</code> → Undo
                </p>
                <p>
                  <code className="bg-gray-200 text-black px-1 py-0.5 rounded">ctrl+y</code> → Redo
                </p>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NewPostHelper;
