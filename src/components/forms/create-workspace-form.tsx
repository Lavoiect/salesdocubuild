'use client'
import { saveActivityLogsNotification, upsertDocument, upsertWorkspace } from "@/lib/queries";
import { CreateDocumentFormSchema, CreateWorkspaceFormSchema } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Document } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
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


interface CreateWorkspaceProps {
    defaultData?: Document
    agencyId:string
}

const CreateWorkspaceForm: React.FC<CreateWorkspaceProps> = ({
    defaultData,
    agencyId
}) => {
    const {setClose} = useModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(CreateWorkspaceFormSchema),
        defaultValues: {
            name: defaultData?.name || '',
            description: defaultData?.description || '',
            favicon: defaultData?.favicon || '',
            subDomainName: defaultData?.subDomainName || '',
        }
    })

    useEffect(() => {
        if(defaultData){
            form.reset({
                description: defaultData.description || '',
                favicon: defaultData.favicon || '',
                name: defaultData.name || '',
                subDomainName: defaultData.subDomainName || '',
            })
        }
    }, [defaultData])

    const isLoading = form.formState.isLoading

    const onSubmit = async (values: z.infer<typeof CreateWorkspaceFormSchema>) => {
        if(!agencyId) return
        const res = await upsertWorkspace(
            agencyId,
            {...values},
            defaultData?.id || v4()
        )
        await saveActivityLogsNotification({
            agencyId: agencyId,
            description: `Updated funnel \ ${res.name}`,
            
        })
        if(res){
            toast({
                title: 'Success',
                description: 'Saved funnel details'
            })}
        else 
            toast({
                title: 'Opps',
                description: 'Could not save funnel details',
                variant: 'destructive'
            })
        setClose()
        router.refresh()
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Workspace Details</CardTitle>
            </CardHeader>
            <CardContent>
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
                            name="subDomainName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Sub Domain</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sub Domain for funnel" {...field}/>
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
            </CardContent>
        </Card>
    )
}

export default CreateWorkspaceForm