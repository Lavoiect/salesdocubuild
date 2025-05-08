'use client'
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { createMedia, saveActivityLogsNotification } from "@/lib/queries";
import { Input } from "../ui/input";
import FileUpload from "../global/file-upload";
import { Button } from "../ui/button";
import { useModal } from "@/providers/modal-provider";

type Props = {
    agencyId: string;
}

const formSchema = z.object({
    link: z.string().min(1, {message: 'Media file is required'}),
    name: z.string().min(1, {message: 'Name is required'})
})
const UploadMediaForm = ({ agencyId }: Props) => {
    const {setClose} = useModal()
    const {toast} = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: {
            link: '',
            name: ''
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await createMedia(agencyId, values)
            await saveActivityLogsNotification({
                agencyId: response.agencyId,
                description: `Uploaded a media file | ${response.name}`,
            })

            toast({title: 'Success', description: 'Uploaded Media File'})
            setClose()
            router.refresh()
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Could not upload media file'
            })
        }
    }
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Media Information</CardTitle>
                <CardDescription>Enter File details</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>File Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="File name" {...field}/>
                                        </FormControl>
                                    
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="link"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Media File</FormLabel>
                                    <FormControl>
                                        <FileUpload 
                                            apiEndpoint="media"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-4">
                            Upload Media
                        </Button>
                        
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default UploadMediaForm
