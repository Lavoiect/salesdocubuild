import clsx from 'clsx'
import React from 'react'

interface Props {
    children: React.ReactNode
    active?: boolean
    onClick?(): void
}

const ToolButton = ({children, onClick, active} : Props) => {
  return (
    <button 
    onClick={onClick}
    className={clsx('p-2', active ? 'bg-black text-white' : 'text-black')}>
    {children}</button>
  )
}

export default ToolButton