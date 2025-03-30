import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Tools from './tools'
import { useWebEditor } from "@/providers/editor/editor-provider"
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'






type Props = {
    content?: string

}



const TextEditor = ({content}: Props) => {
    const {dispatch, state} = useWebEditor()

    const [myContent, setContent] = useState('');
    
    const editor = useEditor({
        
    extensions: [
        StarterKit,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
        TextStyle,
        Color
          
    ],
    editorProps: {
        attributes: {
            class: 'prose sm:prose-base p-4',
        },
    },
    content: content,
   
    async onUpdate({ editor }) {
    setContent(String(state.editor.selectedElement.content));
    dispatch({
        type: 'UPDATE_ELEMENT',
        payload: {
            elementDetails: {
                name: 'text',
                styles: {},
                type: 'text',
                id: state.editor.selectedElement.id,
                content: {
                        innerText: editor.getHTML()
                    }
                }
            }
        });
        
        }})

  return (
   
    <>
        <Tools editor={editor}/>
        <EditorContent editor={editor} />
    </>
    
  )
}

export default TextEditor