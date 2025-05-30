'use client'

import React from "react"
import { useToast } from "../ui/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { saveActivityLogsNotification, sendInvitation } from "@/lib/queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import Loading from "../global/loading"

interface sendInvitationProps {
    agencyId: string
}
const SendInvitation: React.FC<sendInvitationProps> = ({ agencyId }) => {
    const {toast} = useToast()
    const userDataSchema = z.object({
        email: z.string().email(),
        role: z.enum(['ADMIN', 'USER', 'GUEST'])
    })

    const form = useForm<z.infer<typeof userDataSchema>>({
        resolver: zodResolver(userDataSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            role: 'USER',
            // TODO: add initial permission
        },
    })

    const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
        try {
            const res = await sendInvitation(values.role, values.email, agencyId)
            await saveActivityLogsNotification({
                agencyId: agencyId,
                description: `Invited ${values.email}`,
            })
            toast({
                title: 'Sucess',
                description: 'Created and sent invitaion'
            })
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Opps',
                description: 'Could not send Invitation'
            })
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Invitation</CardTitle>
                <CardDescription>
                    An invitation will be sent to the user. Users who already have an invitation
                    sent out to thier email, will not recieve another invitaion.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-6"
                    >
                        <FormField 
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name='email'
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <FormField 
                        disabled={form.formState.isSubmitting}
                        control={form.control}
                        name = "role"
                        render={({field}) => (
                            <FormItem className="flex-1">
                                <FormLabel>User Role</FormLabel>
                                <Select
                                onValueChange={(value) => field.onChange(value)}
                                defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select user role...'/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="USER">
                                            User
                                        </SelectItem>
                                        
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                        >
                        {form.formState.isSubmitting ? <Loading /> : 'Send Invitation'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SendInvitation
