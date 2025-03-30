'use client'
import { getDocuments, getTemplates, getWorkspaces, saveActivityLogsNotification, upsertDocument, upsertDocumentFromTemplate } from "@/lib/queries";
import { CreateDocumentFormSchema } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Document, DocumentPage, Workspace as PrismaWorkspace } from "@prisma/client";

interface Workspace extends PrismaWorkspace {
    Documents: {
        id: string;
        name: string;
        DocumentPages: {
            id: string;
            name: string;
            content: string
        }[];
    }[];
}
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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";


interface CreateDocFromTemplateWorkspaceProps {
    defaultData?: Document
    agencyId: string
    workspaces: Workspace[]
    workspaceId: string
    
}

const CreateDocFromTemplateWorkspaceForm: React.FC<CreateDocFromTemplateWorkspaceProps> = ({
    defaultData,
    workspaces,
    agencyId,
    workspaceId

}) => {
    const { setClose } = useModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateDocumentFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(CreateDocumentFormSchema),
        defaultValues: {
            name: defaultData?.name || '',
            description: defaultData?.description || '',
            favicon: defaultData?.favicon || '',
            subDomainName: defaultData?.subDomainName || '',

        }
    })

    
    
    useEffect(() => {
        if (defaultData) {
            form.reset({
                description: defaultData.description || '',
                favicon: defaultData.favicon || '',
                name: defaultData.name || '',
                subDomainName: defaultData.subDomainName || '',
            })
        }
    }, [defaultData])

    const isLoading = form.formState.isLoading


    const onSubmit = async (values: z.infer<typeof CreateDocumentFormSchema>) => {
        console.log(value)
       // if (value) return
        const res = await upsertDocumentFromTemplate(
            workspaceId,
            { ...values },
            defaultData?.id || v4(),
           value
        )
        await saveActivityLogsNotification({
            agencyId: agencyId,
            description: `Updated funnel \ ${res.name}`,

        })
        if (res) {
            toast({
                title: 'Success',
                description: 'Saved funnel details'
            })
        }
        else
            toast({
                title: 'Opps',
                description: 'Could not save funnel details',
                variant: 'destructive'
            })
        setClose()
        router.refresh()
    }

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Choose a template to create a new DOcument</CardTitle>
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
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Funnel Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Funnel Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Funnel Description" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="subDomainName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sub Domain</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sub Domain for funnel" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="favicon"
                            render={({ field }) => (
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

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[200px] justify-between"
                                >
                                    {value
                                        ? Array.isArray(workspaces) && workspaces
                                            .filter(workspace => workspace.type === 'Template')
                                            .flatMap(workspace => workspace.Documents)
                                            .find((d) => d.id === value)?.name
                                        : "Select Template..."}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search Templates..." />
                                    <CommandList>
                                        <CommandEmpty>No Template found.</CommandEmpty>
                                        <CommandGroup>
                                            
                                            {workspaces.filter(workspace => workspace.type === 'Template').map((workspace) => (
                                               <div>
                                                <span>{workspace.name}</span>
                                                {workspace.Documents.map((d) => (
                                                    
                                                    <CommandItem
                                                    key={d.id}
                                                    value={d.id}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? "" : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {d.name}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            value === d.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                                ))}
                                               </div>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        
                       
                                   
                       
                        <Button
                            className="w-20 mt-4"
                            disabled={isLoading}
                            type="submit"
                        >{form.formState.isSubmitting ? <Loading /> : 'Save'}</Button>

                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateDocFromTemplateWorkspaceForm