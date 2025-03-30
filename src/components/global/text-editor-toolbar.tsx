import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code, ExternalLink, Heading, Italic, List, ListOrdered, Quote, Strikethrough, Underline } from 'lucide-react'
import React from 'react'
import TextEditorButton from './text-editor-button'
import { Editor, isActive } from '@tiptap/core'
import TextEditorLinkForm from './text-editor-link-form'


interface Props  {
    editor : Editor | null
}

const buttons = [
    {
        task: 'bold',
        icon: <Bold size={20} />,
    },
    {
        task: 'italic',
        icon: <Italic size={20} />,
    },
    {
        task: 'underline',
        icon: <Underline size={20} />,
    },
    {
        task: 'strike',
        icon: <Strikethrough size={20} />,
    },
    {
        task: 'code',
        icon: <Code size={20} />,
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
        task: 'quote',
        icon: <Quote size={20} />,
    },
    {
        task: '2',
        icon: <Heading size={20} />,
    },
] as const

type TaskType = typeof buttons[number]['task']



const TextEditorToolbar = ({editor}: Props) => {

    const handleLinkSubmission = (href: string) => {
        

        if (href === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink()
              .run()
      
            return
          }
      
          // update link
          try {
            editor?.chain().focus().extendMarkRange('link').setLink({ href })
              .run()
          } catch (error) {
            alert(error)
          }
        }
      
        
    

    const handleOnClick = (task: TaskType) => {
        switch (task) {
            case 'bold':
                return editor?.chain().focus().toggleBold().run()
            case 'italic':
                return editor?.chain().focus().toggleItalic().run()
            case 'underline':
                return editor?.chain().focus().toggleUnderline().run()
            case 'strike':
                return editor?.chain().focus().toggleStrike().run()
            case 'code':
                return editor?.chain().focus().toggleCode().run()
            case 'bulletList':
                return editor?.chain().focus().toggleBulletList().run()
            case 'orderedList':
                return editor?.chain().focus().toggleOrderedList().run()
            case 'left':
                return editor?.chain().focus().setTextAlign('left').run()
            case 'right':
                return editor?.chain().focus().setTextAlign('right').run()
            case 'center':
                return editor?.chain().focus().setTextAlign('center').run()
            case 'justify':
                return editor?.chain().focus().setTextAlign('justify').run()
            case '2':
                 editor?.chain().focus().toggleHeading({level: 2}).run()
                break    

        }
    }
    const getInitialLink = () => {
        const attributes = editor?.getAttributes('link')
        if (attributes) {
          return attributes.href
        }
    }
    
   
  return (
    <div className='border-b-2 border-solid flex items-center space-x-1'>
        <TextEditorLinkForm prevousLink={getInitialLink()} onSubmit={handleLinkSubmission}/>
        {buttons.map((icon) => (
            <TextEditorButton 
            isActive={editor?.isActive(icon.task) || editor?.isActive({textAlign: icon.task}) || editor?.isActive('heading', {level:parseInt(icon.task)})} 
            
            onClick={() => handleOnClick(icon.task)}> 
                {icon.icon}
            </TextEditorButton>
                
        ))}
    </div>
  )
}

export default TextEditorToolbar