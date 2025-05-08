import React, { useEffect } from "react"
import { useModal } from "@/providers/modal-provider"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ContactUserFormSchema } from "@/lib/types"
import { z } from "zod"
import { saveActivityLogsNotification } from "@/lib/queries"
import { toast } from "../ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Loading from "../global/loading"

interface ContactUserFormProps  {
    subaccountId: string
}
const ContactUserForm: React.FC<ContactUserFormProps> = ({subaccountId}) => {
    const {setClose, data} = useModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof ContactUserFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(ContactUserFormSchema),
        defaultValues: {
            name: '',
            email: ''
        }
    })
    useEffect(() => {
        if(data.contact) {
            form.reset(data.contact)
        }
    }, [data, form.reset])

    const isLoading = form.formState.isLoading

    const handleSubmit =async (
        values: z.infer<typeof ContactUserFormSchema>
    ) => {
        try {
            const response = await upsertContact({
                email: values.email,
                subAccountId: subaccountId,
                name: values.name
            })
            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Upadated a contact | ${response?.name}`,
                agencyId: subaccountId
            })
            toast({
                title: 'Sucess',
                description: 'Saved information for your contact'
            })
            router.refresh()
            setClose()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Opps",
                description: 'Could not save contact information'
            })
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Contact Info</CardTitle>
                <CardDescription>You can assign tickets to contacts and set a value for each contact in the ticket.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField 
                            disabled={isLoading}
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            disabled={isLoading}
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} type="email"/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button 
                            className="mt-4"
                            disabled={isLoading}
                            type="submit"
                        >
                            {form.formState.isSubmitting ? (
                                <Loading/>
                            ): (
                                'Save Contact Details'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ContactUserForm
