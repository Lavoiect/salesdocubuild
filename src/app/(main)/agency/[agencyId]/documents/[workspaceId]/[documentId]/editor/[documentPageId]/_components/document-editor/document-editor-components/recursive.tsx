import { EditorElement } from "@/providers/editor/editor-provider"
import TextComponent from "./text"
import Container from "./container"
import VideoComponent from "./video"
import LinkComponent from "./link"
import ImageComponent from "./image"
import ButtonComponent from "./button"
import ThreeColumns from "./three-column-container"

type Props = {
    element: EditorElement
    index?: number
    parentId?: string

}

const Recursive = ({element, index, parentId}: Props) => {
  
    switch (element.type) {
        case 'text':
          return <TextComponent  key={element.id} element={element}/>
        case 'container':
          return <Container index={index} element={element} parentId={parentId}/>
        case '__body':
          return <Container element={element} parentId={parentId}/>
        case '2Col':
            return <Container index={index} element={element} parentId={parentId}/>
        case '3Col':
            return <ThreeColumns index={index} element={element} parentId={parentId}/>
        case 'video':
            return <VideoComponent element={element} />
        case 'link':
            return <LinkComponent element={element} parentId={parentId}/>
        case 'image':
            return <ImageComponent index={index} element={element}/>
        case 'button':
            return <ButtonComponent element={element}  parentId={parentId} index={index}/>
          
        default:
          return null
      }
   
}

export default Recursive
