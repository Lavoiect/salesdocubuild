'use client'
import React, { use, useEffect, useState } from 'react'
import TextEditorButton from './text-editor-button'
import { Link } from 'lucide-react'
import { set } from 'date-fns'

interface Props  {
    prevousLink: string
    onSubmit: (link: string) => void
}

const TextEditorLinkForm = ({prevousLink, onSubmit}: Props) => {
    const [showForm, setShowForm] = useState(false)
    const [link, setLink] = useState(prevousLink || '')
    
    useEffect(() => {
        if (prevousLink) {
            setLink(prevousLink)}
    }, [prevousLink])

    const showLinkForm = () => {
       setShowForm(true)
       if (prevousLink) {
           setLink(prevousLink)
       }
    }

  return (
    <div>
        <TextEditorButton onClick={() => showLinkForm()}>
            <Link size={20} />
        </TextEditorButton>
        {showForm && (
            <div className="z-50 absolute ring-1 ring-black rounded flex items-center bg-white p-4 shadow-md">
                <input 
                value={link}
                onChange={({target}) => setLink(target.value)}
                onBlur={() => setShowForm(false)} 
                className='outline-none' 
                type='text' 
                placeholder='Enter URL' />
                <button 
                
                onMouseDown={() => {
                   onSubmit(link)
                    setShowForm(false)
                    setLink('')
                   
                }}>Ok</button>
            </div>
        )}
    </div>
   
    
  )
}

export default TextEditorLinkForm