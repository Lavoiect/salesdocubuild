'use client'
import React, { useEffect } from 'react'
import { EditorProvider, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'




import TextEditorToolbar from './text-editor-toolbar'

type EditorProps = {
  onChange: (content: string) => void;

  initialValue?: string
}


const extensions = [
  StarterKit, 
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: {
      target: '_blank',
    },
    defaultProtocol: 'https',
    protocols: ['http', 'https'],
    isAllowedUri: (url, ctx) => {
      try {
        // construct URL
        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

        // use default validation
        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false
        }

        // disallowed protocols
        const disallowedProtocols = ['ftp', 'file', 'mailto']
        const protocol = parsedUrl.protocol.replace(':', '')

        if (disallowedProtocols.includes(protocol)) {
          return false
        }

        // only allow protocols specified in ctx.protocols
        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

        if (!allowedProtocols.includes(protocol)) {
          return false
        }

        // disallowed domains
        const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
        const domain = parsedUrl.hostname

        if (disallowedDomains.includes(domain)) {
          return false
        }

        // all checks have passed
        return true
      } catch {
        return false
      }
    },
    shouldAutoLink: url => {
      try {
        // construct URL
        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

        // only auto-link if the domain is not in the disallowed list
        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
        const domain = parsedUrl.hostname

        return !disallowedDomains.includes(domain)
      } catch {
        return false
      }
    },

  }),

  Placeholder.configure({
    placeholder: 'Add your text here...',
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
]


const CourseTextEditor = ({initialValue, onChange}: EditorProps) => {
  const editor = useEditor({
    extensions,
    content: initialValue,
    onUpdate : ({editor}) => {
      onChange(editor.getHTML())
  },
    editorProps:{
      attributes: {
        class: 'prose sm:prose-base p-4',
    },
  },
  immediatelyRender: false
  })



const view = editor?.view

  useEffect(() => {
    const { from, to } = view?.state.selection || { from: 0, to: 0 }
    if (editor && view) {
      if (initialValue !== undefined) {
        editor.commands.setContent(initialValue || '', false, {preserveWhitespace: "full"});
        editor.commands.setTextSelection({ from: from, to: to })
      }

    }
  }, [editor, initialValue])

  return (
    <div className='border-2 border-solid rounded-sm'>
      <TextEditorToolbar editor={editor} />
      <EditorContent editor={editor} />
       
    </div>
  )
}

export default CourseTextEditor