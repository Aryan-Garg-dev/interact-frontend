'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Document from '@tiptap/extension-document';
import Blockquote from '@tiptap/extension-blockquote';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CodeBlock from '@tiptap/extension-code-block';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';
import { ColorHighlighter } from './extensions/color-highlighter';
import { SmilieReplacer } from './extensions/smilie-replacer';
import CountWidget from './widgets/count-widget';
import LinkDialog from './widgets/link-dialog';
import Toaster from '@/utils/toaster';
import InteractMentions from '@/components/editor/mentions/mention-extension';

type EditorProps =
  | {
      editable: true;
      setContent: React.Dispatch<React.SetStateAction<string>>;
      content?: string;
      placeholder?: string;
      limit?: number | null;
      className?: string;
    }
  | {
      editable: false;
      content: string;
      setContent?: never;
      placeholder?: never;
      limit?: never;
      className?: string;
    };

const Editor = ({
  content = '',
  setContent = () => {},
  editable,
  limit = null,
  placeholder,
  className,
}: EditorProps) => {
  //TODO: Custom KeyMaps
  const editor = useEditor({
    content: content || '',
    extensions: [
      // StarterKit.configure({}),
      Document,
      Paragraph,
      Text,
      Blockquote, // >
      ListItem,
      BulletList, // +, *, +
      OrderedList, // 1.
      Heading.configure({
        // #, ##, ###
        levels: [1, 2, 3],
      }),
      HorizontalRule, // ---
      CodeBlock, // ```
      TaskItem, // - [ ]
      TaskList,
      Bold, // **Bold** __bold__ ctrl+b
      Italic, // *Italic* _italic_ ctrl+i
      Highlight, // ==Highlight==
      Strike.configure({
        // ~~Strike~~
        HTMLAttributes: {
          class: 'line-through decoration-neutral-700',
        },
      }),
      Underline, // ctrl+u
      Code, // `code`
      Subscript, // ctrl+,
      Superscript, // ctrl+.
      Typography,
      // ColorHighlighter,
      SmilieReplacer,
      CharacterCount.configure({
        limit,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Type something...',
      }),
      History, // ctrl+z, ctrl+y
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        //TODO: Configure allowed and disallowed URIs, domains, protocols, etc.
        isAllowedUri: (url, ctx) => ctx.defaultValidate(url) && !url.startsWith('./'),
        shouldAutoLink: url => url.startsWith('https://'),
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
          class: '',
        },
      }),
      InteractMentions,
      // customKeyMap
    ],

    editable: editable,
    editorProps: {
      attributes: {
        class: `py-0.5 ring-0 h-full outline-none z-0 ${className}`,
      },
    },
    // autofocus: true,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [URL, setURL] = useState<string>('');

  const onSubmitURL = () => {
    if (!editor) return;

    if (!URL) {
      Toaster.error('Link cannot be empty', 'error_toaster');
      return;
    } else if (!URL.startsWith('http')) {
      Toaster.error('List must start with https://', 'error_toaster');
      return;
    }

    try {
      editor.chain().focus().extendMarkRange('link').setLink({ href: URL }).run();
      setOpenLinkDialog(false);
    } catch (e) {
      Toaster.error((e as Error).message, 'error_toaster');
    }
  };

  useEffect(() => {
    if (!editor) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        setOpenLinkDialog(true);
      }
    };
    document.addEventListener('keydown', handleKeydown);

    return () => document.removeEventListener('keydown', handleKeydown);
  }, [editor]);

  if (!editor) {
    return null;
  }

  const charCount = editor ? editor.storage.characterCount.characters() : 0;

  return (
    <div className="flex flex-col justify-stretch">
      <EditorContent editor={editor} />
      {editor && editable && limit && <CountWidget charCount={charCount} limit={limit} className="m-1 ml-2" />}
      {editor && editable && (
        <LinkDialog open={openLinkDialog} setOpen={setOpenLinkDialog} setURL={setURL} onSubmit={onSubmitURL} />
      )}
    </div>
  );
};

export default Editor;
