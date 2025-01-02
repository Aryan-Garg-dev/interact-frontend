import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { RawCommands } from '@tiptap/core'

export interface FileHandlerOptions {
  maxSize?: number
  allowedTypes?: string[]
  onUpload?: (file: File) => Promise<string>
}

interface FileHandlerCommands {
  uploadFile: (file: File) => boolean
}

export const FileHandler = Extension.create<FileHandlerOptions>({
  name: 'fileHandler',

  addOptions() {
    return {
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['image/*', 'application/pdf'],
      onUpload: async () => "https://interactnow.in/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Finteract-public%2Fusers%2FprofilePics%2Fe046022c-17d9-4285-937d-75943742391b-2024-12-18T08%3A29%3A32Z-prof_groot_warn.jpeg-resized.jpg&w=128&q=75",
    }
  },

  addProseMirrorPlugins() {
    const extension = this

    return [
      new Plugin({
        key: new PluginKey('fileHandler'),
        props: {
          handleDrop: (view, event, slice, moved) => {
            if (!event.dataTransfer?.files || moved) {
              return false
            }

            const files = Array.from(event.dataTransfer.files)
            handleFiles(files, view, extension.options)
            return true
          },

          handlePaste: (view, event) => {
            const files = Array.from(event.clipboardData?.files || [])
            if (!files.length) return false

            handleFiles(files, view, extension.options)
            return true
          },
        },
      }),
    ]
  },

  addCommands() {
    return {
      uploadFile: (file: File) => (editor: any) => {
        handleFiles([file], editor.view, this.options)
        return true
      },
    } as Partial<RawCommands>
  },
})

function validateFile(file: File, options: FileHandlerOptions): boolean {
  if (file.size > options.maxSize!) {
    console.error(`File too large. Max size: ${options.maxSize} bytes`)
    return false
  }

  const isAllowedType = options.allowedTypes!.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -2))
    }
    return file.type === type
  })

  if (!isAllowedType) {
    console.error('File type not allowed')
    return false
  }

  return true
}

async function handleFiles(files: File[], view: any, options: FileHandlerOptions) {
  for (const file of files) {
    if (!validateFile(file, options)) continue

    try {
      const url = await options.onUpload!(file)
      if (!url) continue

      const { schema } = view.state
      const node = schema.nodes.image
        ? schema.nodes.image.create({ src: url })
        : schema.text(url)

      const transaction = view.state.tr.replaceSelectionWith(node)
      view.dispatch(transaction)
    } catch (error) {
      console.error('File upload failed:', error)
    }
  }
}