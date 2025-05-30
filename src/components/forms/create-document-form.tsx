'use client'
import { saveActivityLogsNotification, upsertDocument } from "@/lib/queries";
import { CreateDocumentFormSchema } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Document } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import FileUpload from "../global/file-upload";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { Textarea } from "../ui/textarea";
import { set } from "date-fns";
import AIPrompt from "@/data/promt";
import PromtForm from "./promt-form";


interface CreateDocumentProps {
    defaultData?: Document
    workspaceId:string
    useAi: boolean,
    type: string
}

const CreateDocumentForm: React.FC<CreateDocumentProps> = ({
    defaultData,
    workspaceId,
    useAi,
    type
}) => {
    const {setClose} = useModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateDocumentFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(CreateDocumentFormSchema),
        defaultValues: {
            name: defaultData?.name || '',
            description: defaultData?.description || '',
            favicon: defaultData?.favicon || '',
            
        }
    })
    const [showAIPrompt, setShowAIPrompt] = useState(false)
    const [showDocDetails, setDocDetails] = useState(true)
    const [docId, setDocId] = useState<string>()
    
    useEffect(() => {
        if(defaultData){
            form.reset({
                description: defaultData.description || '',
                favicon: defaultData.favicon || '',
                name: defaultData.name || '',
            })
        }
    }, [defaultData])

    const isLoading = form.formState.isLoading


    const onSubmit = async (values: z.infer<typeof CreateDocumentFormSchema>) => {
        if(!workspaceId) return
        const documentId = defaultData?.id || v4();
        setDocId(documentId);
        const res = await upsertDocument(
            workspaceId,
            {...values},
            documentId,
            type,
            undefined,
            useAi
            
        )
        setDocId(documentId)
        await saveActivityLogsNotification({
            agencyId: workspaceId,
            description: `Updated document \ ${res.name}`,
            
        })
        if(res){
            toast({
                title: 'Success',
                description: 'Saved document details'
            })}
        else 
            toast({
                title: 'Opps',
                description: 'Could not save document details',
                variant: 'destructive'
            })
       if(!useAi)setClose()
         setDocDetails(false)
         setShowAIPrompt(true)
        router.refresh()
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Document Details  boolean
               </CardTitle>
            </CardHeader>
            <CardContent>
                {showDocDetails && (
                     <Form {...form}>
                     <form 
                         onSubmit={form.handleSubmit(onSubmit)}
                         className="flex flex-col gap-4"
                     >
                         <FormField 
                             disabled={isLoading}
                             control={form.control}
                             name="name"
                             render={({field}) => (
                                 <FormItem>
                                     <FormLabel>Funnel Name</FormLabel>
                                     <FormControl>
                                         <Input placeholder="Name" {...field}/>
                                     </FormControl>
                                 </FormItem>
                             )}
                         />
 
                         <FormField 
                             disabled={isLoading}
                             control={form.control}
                             name="description"
                             render={({field}) => (
                                 <FormItem>
                                     <FormLabel>Funnel Description</FormLabel>
                                     <FormControl>
                                         <Input placeholder="Funnel Description" {...field}/>
                                     </FormControl>
                                 </FormItem>
                             )}
                         />
                    
 
                         <FormField 
                             disabled={isLoading}
                             control={form.control}
                             name="favicon"
                             render={({field}) => (
                                 <FormItem>
                                     <FormLabel>Favicon</FormLabel>
                                     <FormControl>
                                         <FileUpload 
                                             apiEndpoint="subaccountLogo"
                                             value={field.value}
                                             onChange={field.onChange}
                                         />
                                     </FormControl>
                                 </FormItem>
                             )}
                         />
                         <Button 
                             className="w-20 mt-4"
                             disabled={isLoading}
                             type="submit"
                         >{form.formState.isSubmitting ? <Loading/> : 'Save'}</Button>
                         
                     </form>
                 </Form>
                )}
                {showAIPrompt && useAi && (
                     <PromtForm documentId={docId}/>
                )}
               
            </CardContent>
        </Card>
    )
}

export default CreateDocumentForm