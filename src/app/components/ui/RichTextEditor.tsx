import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { 
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, 
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, ImageIcon, Quote,
  Highlighter, Undo, Redo, CheckSquare
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Nhập đường dẫn hình ảnh (URL):')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const Btn = ({ onClick, isActive, disabled, title, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${isActive ? 'bg-gray-200 text-blue-600 font-bold' : 'text-gray-600'}`}
      title={title}
    >
      {children}
    </button>
  )

  const Separator = () => <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-gray-200 bg-gray-50/80 rounded-t-lg">
      <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} title="Hoàn tác (Ctrl+Z)">
        <Undo className="w-4 h-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} title="Tiến tới (Ctrl+Y)">
        <Redo className="w-4 h-4" />
      </Btn>

      <Separator />

      <Select
        value={
          editor.isActive('heading', { level: 1 }) ? 'h1' :
          editor.isActive('heading', { level: 2 }) ? 'h2' :
          editor.isActive('heading', { level: 3 }) ? 'h3' :
          editor.isActive('heading', { level: 4 }) ? 'h4' :
          editor.isActive('heading', { level: 5 }) ? 'h5' :
          editor.isActive('heading', { level: 6 }) ? 'h6' : 'p'
        }
        onValueChange={(value) => {
          if (value === 'p') {
            editor.chain().focus().setParagraph().run();
          } else {
            const level = parseInt(value.replace('h', ''), 10) as any;
            editor.chain().focus().toggleHeading({ level }).run();
          }
        }}
      >
        <SelectTrigger className="h-8 w-28 text-xs border-transparent bg-transparent hover:bg-gray-200 shadow-none focus:ring-0">
          <SelectValue placeholder="Chữ thường" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="p">Chữ thường</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
          <SelectItem value="h5">Heading 5</SelectItem>
          <SelectItem value="h6">Heading 6</SelectItem>
        </SelectContent>
      </Select>

      <Separator />

      <Btn onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="In đậm">
        <Bold className="w-4 h-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="In nghiêng">
        <Italic className="w-4 h-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Gạch chân">
        <UnderlineIcon className="w-4 h-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Gạch ngang">
        <Strikethrough className="w-4 h-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} disabled={!editor.can().chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Khối nổi bật (Highlight)">
        <Highlighter className="w-4 h-4" />
      </Btn>

      <Separator />

      <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Căn trái">
        <AlignLeft className="w-4 h-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Căn giữa">
        <AlignCenter className="w-4 h-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Căn phải">
        <AlignRight className="w-4 h-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Căn đều">
        <AlignJustify className="w-4 h-4" />
      </Btn>

      <Separator />

      <Select
        value={
          editor.isActive('bulletList') ? 'bullet' :
          editor.isActive('orderedList') ? 'ordered' :
          editor.isActive('taskList') ? 'task' : 'none'
        }
        onValueChange={(value) => {
          if (value === 'bullet') {
            editor.chain().focus().toggleBulletList().run()
          } else if (value === 'ordered') {
            editor.chain().focus().toggleOrderedList().run()
          } else if (value === 'task') {
            editor.chain().focus().toggleTaskList().run()
          } else {
             if(editor.isActive('bulletList')) editor.chain().focus().toggleBulletList().run()
             if(editor.isActive('orderedList')) editor.chain().focus().toggleOrderedList().run()
             if(editor.isActive('taskList')) editor.chain().focus().toggleTaskList().run()
          }
        }}
      >
        <SelectTrigger className="h-8 w-14 px-2 border-transparent bg-transparent hover:bg-gray-200 shadow-none focus:ring-0 [&>svg]:hidden">
          <div className="flex items-center justify-center w-full">
            {editor.isActive('bulletList') ? <List className="w-4 h-4" /> : 
             editor.isActive('orderedList') ? <ListOrdered className="w-4 h-4" /> : 
             editor.isActive('taskList') ? <CheckSquare className="w-4 h-4" /> : 
             <List className="w-4 h-4 text-gray-500" />}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Trống</SelectItem>
          <SelectItem value="bullet"><div className="flex items-center gap-2"><List className="w-4 h-4"/> Dấu chấm</div></SelectItem>
          <SelectItem value="ordered"><div className="flex items-center gap-2"><ListOrdered className="w-4 h-4"/> Đánh số</div></SelectItem>
          <SelectItem value="task"><div className="flex items-center gap-2"><CheckSquare className="w-4 h-4"/> Danh sách việc</div></SelectItem>
        </SelectContent>
      </Select>
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Trích dẫn">
        <Quote className="w-4 h-4" />
      </Btn>

      <Separator />

      <Btn onClick={addImage} isActive={false} title="Thêm hình ảnh (Hỗ trợ Paste ảnh trực tiếp)">
        <ImageIcon className="w-4 h-4" />
      </Btn>
    </div>
  )
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        allowBase64: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Nhập nội dung...',
        emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-gray-400 before:pointer-events-none',
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'max-w-none focus:outline-none min-h-[150px] p-3 text-sm text-gray-700 editor-content',
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                  const node = view.state.schema.nodes.image.create({ src: result });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                }
              };
              reader.readAsDataURL(file);
              return true; // Ngăn chặn hành vi paste mặc định để dùng ảnh Base64
            }
          }
        }
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  })

  // Theo dõi cập nhật nội dung từ props nếu có sự thay đổi từ bên ngoài (ví dụ: khi reset form)
  if (editor && content !== editor.getHTML() && !editor.isFocused && content !== undefined) {
    setTimeout(() => {
        if(editor) {
            const currentContent = editor.getHTML()
            if(content !== currentContent && content !== '<p></p>') {
                editor.commands.setContent(content)
            } else if (content === '' && currentContent !== '<p></p>') {
                editor.commands.setContent('')
            }
        }
    })
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
      <style>{`
        .editor-content p { margin-bottom: 0.5em; }
        .editor-content p:last-child { margin-bottom: 0; }
        .editor-content h1 { font-size: 1.5em; font-weight: 700; margin-top: 1em; margin-bottom: 0.5em; color: #111827; }
        .editor-content h2 { font-size: 1.25em; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em; color: #1f2937; }
        .editor-content h3 { font-size: 1.1em; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em; color: #374151; }
        .editor-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.5em; }
        .editor-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 0.5em; }
        .editor-content blockquote { border-left: 3px solid #e5e7eb; padding-left: 1rem; font-style: italic; color: #6b7280; margin: 1em 0; }
        .editor-content img { max-width: 100%; height: auto; border-radius: 0.375rem; margin: 0.5em 0; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .editor-content strong { font-weight: 600; color: #111827; }
        .editor-content em { font-style: italic; }
        .editor-content s { text-decoration: line-through; }
        .editor-content u { text-decoration: underline; }
        .editor-content mark { background-color: #fef08a; padding: 0.125em 0; border-radius: 0.25em; box-decoration-break: clone; }
        
        ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        ul[data-type="taskList"] p {
          margin: 0;
        }
        ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }
        ul[data-type="taskList"] li > label input {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 0.25rem;
          border-color: #d1d5db;
          color: #3b82f6;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
          cursor: pointer;
        }
        ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
      `}</style>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="cursor-text" />
    </div>
  )
}
