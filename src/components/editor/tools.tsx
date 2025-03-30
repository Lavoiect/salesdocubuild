import { AlignCenter, AlignJustify, AlignLeft, AlignRight, BoldIcon, Heading1Icon, Heading2, ItalicIcon, List, ListOrdered, LucideHeading3, Strikethrough, Underline, UnderlineIcon } from 'lucide-react'
import React from 'react'
import ToolButton from './tool-button'
import { Editor } from '@tiptap/react'

type Props = {
    editor: Editor | null
}

const tools = [
    {
        task: 'bold',
        icon: <BoldIcon size={20} />
    },
    {
        task: 'italic',
        icon: <ItalicIcon size={20} />
    },
    {
        task: 'underline',
        icon: <UnderlineIcon size={20} />
    },
    {
        task: 'strike',
        icon: <Strikethrough size={20} />,
    },
    {
        task: 'orderedList',
        icon: <ListOrdered size={20} />,
    },
    {
        task: 'bulletList',
        icon: <List size={20} />,
    },
    {
        task: 'left',
        icon: <AlignLeft size={20} />,
    },
    {
        task: 'right',
        icon: <AlignRight size={20} />,
    },
    {
        task: 'center',
        icon: <AlignCenter size={20} />,
    },
    {
        task: 'justify',
        icon: <AlignJustify size={20} />,
    },
    {
        task: '1',
        icon: <Heading1Icon size={20} />,
    },
    {
        task: '2',
        icon: <Heading2 size={20} />,
    },
    {
        task: '3',
        icon: <LucideHeading3 size={20} />,
    },

] as const

type TaskType = (typeof tools)[number]['task']

const Tools = ({ editor }: Props) => {

    const handleOnClick = (task: TaskType) => {
        switch (task) {
            case 'bold':
                editor?.chain().focus().toggleBold().run()
                break
            case 'italic':
                editor?.chain().focus().toggleItalic().run()
                break
            case 'strike':
                editor?.chain().focus().toggleStrike().run()
                break
            case 'bulletList':
                editor?.chain().focus().toggleBulletList().run()
                break
            case 'orderedList':
                editor?.chain().focus().toggleOrderedList().run()
                break
            case 'left':
                return editor?.chain().focus().setTextAlign('left').run()
            case 'right':
                return editor?.chain().focus().setTextAlign('right').run()
            case 'center':
                return editor?.chain().focus().setTextAlign('center').run()
            case 'justify':
                return editor?.chain().focus().setTextAlign('justify').run()
            case '1':
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
                break
            case '2':
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
                break
            case '3':
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
                break
        }
    }


    return (
        <div className='!text-left'>
            <input
            type="color"
            onInput={event => editor?.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
            value={editor?.getAttributes('textStyle').color}
            data-testid="setColor"
          />
            {tools.map(({ icon, task }) => (
                <ToolButton
                    onClick={() => handleOnClick(task)}
                        active={editor?.isActive(task) || editor?.isActive({ textAlign: task }) || editor?.isActive('heading', { level: parseInt(task) })}
                    >
                        {icon}
                    </ToolButton>
            ))}
        </div>
    )
}

export default Tools