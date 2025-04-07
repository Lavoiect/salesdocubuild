import { EditorElement } from "@/providers/editor/editor-provider"
import TextComponent from "./text"
import Container from "./container"
import VideoComponent from "./video"
import LinkComponent from "./link"
import ImageComponent from "./image"

type Props = {
    element: EditorElement
    index?: number
    
}

const Recursive = ({element, index}: Props) => {
  
    switch (element.type) {
        case 'text':
          return <TextComponent  key={element.id} element={element} />
        case 'container':
          return <Container index={index} element={element} />
        case '__body':
          return <Container element={element} />
        case '2Col':
            return <Container index={index} element={element} />
        case '3Col':
            return <Container index={index} element={element} />
        case 'video':
            return <VideoComponent element={element} />
        case 'link':
            return <LinkComponent element={element} />
        case 'image':
            return <ImageComponent index={index} element={element} />
          
        default:
          return null
      }
   
}

export default Recursive
