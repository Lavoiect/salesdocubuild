import clsx from 'clsx'
import React, { ReactNode } from 'react'

interface Props  {
    children: ReactNode
    onClick: () => void
    isActive?: boolean
}

const TextEditorButton = ({children, isActive, onClick} : Props) => {
  return (
    <button
        type='button'
        onClick={onClick}
        className={clsx("p-2", isActive ? "bg-gray-200 text-white" : "text-black")}
    >
      {children}
    </button>
  )
}

export default TextEditorButton