import React, { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import axios from 'axios';
import AIPrompt from '@/data/promt';
import { useModal } from '@/providers/modal-provider';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';


type Props = {
    documentId?: string,
}

const PromtForm = (props: Props) => {
      const {setClose} = useModal()
      const router = useRouter()
      
  
    const [userInput, setUserInput] = useState<string>('')

    const onGenerate = async ()=>{
            const PROMPT = AIPrompt.SALES_DOC_PROMPT+"\n-"+userInput;
            
            try {
                const res = await axios.post('/api/AIModel', {
                    prompt: PROMPT,
                    documentId: props.documentId
                })

                if (res) {
                  console.log('should route')
                  setClose()
                  router.refresh()                }
               //console.log(res)
            } catch (error) {
              //  console.error('Error generating document:', error);
            }
        }
  return (
    <div>
                        {props.documentId}
                     <p>Enter details of what you want to create with AI.</p>
                     <Textarea onChange={(e) => setUserInput(e.target.value)} placeholder="Type here"/>
                     <Button onClick={onGenerate}>Generate</Button>
                 </div>
  )
}

export default PromtForm