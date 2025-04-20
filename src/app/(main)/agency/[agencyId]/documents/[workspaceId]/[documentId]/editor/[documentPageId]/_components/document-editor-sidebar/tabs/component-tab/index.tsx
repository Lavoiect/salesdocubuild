import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { EditorBtns } from '@/lib/constants'
import React from 'react'
import TextPlaceholder from './text-placeholder'
import ContainerPlaceholder from './container-placeholder'
import VideoPlaceholder from './video-placeholder'
import LinkPlaceholder from './link-placeholder'
import TwoColumnPlaceholder from './two-column-placeholder'
import ContactFormComponentPlaceholder from './contact-form-placeholder'
import ImagePlaceholder from './image-placeholder'
import ThreeColumnPlaceholder from './three-column-placeholder'
import { LayoutDashboard } from 'lucide-react'
import ButtonPlaceholder from './button-placeholder'


type Props = {}

const ComponentsTab = (props: Props) => {
    const elements:{
        Component: React.ReactNode
        label: string
        id: EditorBtns
        group: 'layout' | 'elements'
    }[] = [
        {
            Component: <TextPlaceholder/>,
            label: 'Text',
            id: 'text',
            group: 'elements'
        },
        {
            Component: <ContainerPlaceholder/>,
            label: 'Container',
            id: 'container',
            group: 'layout'
        },
        {
            Component: <TwoColumnPlaceholder/>,
            label: '2 Columns',
            id: '2Col',
            group: 'layout'
        },
        {
            Component: <ThreeColumnPlaceholder/>,
            label: '3 Columns',
            id: '3Col',
            group: 'layout'
        },
        {
            Component: <VideoPlaceholder/>,
            label: 'Video',
            id: 'video',
            group: 'elements'
        },
        {
            Component: <LinkPlaceholder/>,
            id: 'link',
            label: 'Link',
            group: 'elements'
        },
        {
            Component: <ContactFormComponentPlaceholder/>,
            id: 'contactForm',
            label: 'Form',
            group: 'elements'
        },
        {
            Component: <ImagePlaceholder/>,
            id: 'image',
            label: 'Image',
            group: 'elements'
        },
        {
            Component: <ButtonPlaceholder/>,
            id: 'button',
            label: 'Button',
            group: 'elements'
        }
    ]

    const squareDashedIcon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-dashed-icon lucide-square-dashed"><path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M21 19a2 2 0 0 1-2 2"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M9 3h1"/><path d="M9 21h1"/><path d="M14 3h1"/><path d="M14 21h1"/><path d="M3 9v1"/><path d="M21 9v1"/><path d="M3 14v1"/><path d="M21 14v1"/></svg>

  return (
    <Accordion
        type='multiple'
        className='w-full'
        defaultValue={['layout', 'elements']}
    >
        <AccordionItem
            value='layout'
            className='px-6 py-0 border-y-[1px]'
            >
                <AccordionTrigger className='!no-underline'><div className='flex items-center gap-2'><span className='text-muted-foreground'>{squareDashedIcon}</span>Containers</div></AccordionTrigger>
                <AccordionContent className='grid grid-cols-1 md:grid-cols-2 gap-3 w-full'>
            {elements
                .filter((element) => element.group === 'layout')
                .map((element) => (
                    <div key={element.id} className='flex-col items-center justify-center flex border
                    border-dashed rounded-xl p-3
                    group hover:shadow-md hover:border-primary cursor-pointer
                    '>
                        {element.Component}
                        <span className='group-hover:text-primary text-muted-foreground'>{element.label}</span>
                    </div>
                    
                ))
                }
        </AccordionContent>
        </AccordionItem>
        <AccordionItem
            value='elements'
            className='px-6 py-0'
            >
                <AccordionTrigger className='!no-underline'><div className='flex items-center gap-2'><span className='text-muted-foreground'><LayoutDashboard size={20}/></span>Elements</div></AccordionTrigger>
        <AccordionContent className='grid grid-cols-1 md:grid-cols-2 gap-3 w-full'>
            {elements
                .filter((element) => element.group === 'elements')
                .map((element) => (
                    <div key={element.id} className='flex-col items-center justify-center flex border
                    border-dashed rounded-xl p-3
                    group hover:shadow-md hover:border-primary cursor-pointer
                    '>{element.Component}
                    <span className='group-hover:text-primary text-muted-foreground'>{element.label}</span>
                    </div>
                    
                ))
                }
        </AccordionContent>
        </AccordionItem>
        
        
    </Accordion>
  )
}

export default ComponentsTab