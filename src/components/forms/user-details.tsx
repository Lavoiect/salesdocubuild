'use client'
import { AuthUserWithAgency} from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import {  User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { getAuthUserDetails, updateUser} from "@/lib/queries";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { Separator } from "../ui/separator";



type Props = {
    id: string | null
    type: 'agency'
    userData?: Partial<User>
}

const UserDetails = ({id, type, userData}: Props) => {
   

    const {data, setClose} = useModal()
    const [roleState, setRoleState] = useState('')
    const [authUserData, setAuthUserData] = useState<AuthUserWithAgency | null>(null)
    const {toast} = useToast()
    const router = useRouter()

    useEffect(() => {
        if(data.user){
            const fetchDetails = async () => {
                const response = await getAuthUserDetails()
                if(response) setAuthUserData(response)
            }
            fetchDetails()
        }
    }, [data])

    const userDataSchema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        avatarUrl: z.string(),
        role: z.enum([
            'OWNER',
            'ADMIN',
            'USER',
        ]),
    })

    const form = useForm<z.infer<typeof userDataSchema>>({
        resolver: zodResolver(userDataSchema),
        mode: 'onChange',
        defaultValues: {
            name: userData ? userData.name : data?.user?.name,
            email: userData ? userData.email : data?.user?.email,
            avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
            role: userData && ["OWNER", "ADMIN", "USER"].includes(userData.role as string)
                ? (userData.role as "OWNER" | "ADMIN" | "USER")
                : data?.user?.role && ["OWNER", "ADMIN", "USER"].includes(data.user.role as string)
                ? (data.user.role as "OWNER" | "ADMIN" | "USER")
                : undefined,

        }
    })

   
    useEffect(() => {
        if(data.user){
            form.reset({
                name: data.user.name,
                avatarUrl: data.user.avatarUrl,
                email: data.user.email,
                role: data.user.role as "OWNER" | "ADMIN" | "USER",
            })
        }
        if (userData) {
            form.reset({
                ...userData,
                role: userData?.role as "OWNER" | "ADMIN" | "USER" | undefined,
            })
        }
    }, [userData, data])

    
            
        
    

    const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
        console.log('something')
        if (!id) return
        if (userData || data?.user) {
          const updatedUser = await updateUser(values)
         
    
          if (updatedUser) {
            toast({
              title: 'Success',
              description: 'Update User Information',
            })
            setClose()
            router.refresh()
          } else {
            toast({
              variant: 'destructive',
              title: 'Oppse!',
              description: 'Could not update user information',
            })
          }
        } else {
          console.log('Error could not submit')
        }
      }
    

    return ( 
        <Card className="w-full">
            <CardHeader>
            <CardTitle>User Details</CardTitle>
                <CardDescription>Add or Update your Information</CardDescription>
            </CardHeader>  
            <CardContent>
                <Form {...form}>
                    <form 
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-4"
                    >
                    <FormField
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name="avatarUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Profile picture</FormLabel>
                                <FormControl>
                                    <FileUpload
                                    apiEndpoint="avatar"
                                    value={field.value}
                                    onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    <FormField
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>User Name</FormLabel>
                                <FormControl>
                                   <Input
                                        required
                                        placeholder="Full Name"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                   <Input
                                        
                                        readOnly={
                                            userData?.role === 'OWNER' || 
                                            form.formState.isSubmitting
                                        }
                                        required
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
                            name="role"
                            render={({field}) => (
                            <FormItem className="flex-1">
                                <FormLabel>User Role:</FormLabel>
                                <Select
                                    disabled={field.value === 'OWNER'}
                                    onValueChange={(value) => {
                                        if(
                                            value === "SUBACCOUNT_USER" ||
                                            value === "SUBACCOUNT_GUEST"
                                            ){
                                                setRoleState(
                                                    'You need to have subaccoutns to assign a subaccont access to team members.'
                                                )
                                            } else {
                                                setRoleState('')
                                            }
                                            field.onChange(value)
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user role..."/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        {(data?.user?.role ==='OWNER' || userData?.role ==="OWNER")
                                        && (
                                            <SelectItem value="OWNER">Owner</SelectItem>
                                        )}
                                        <SelectItem value="USER">User</SelectItem>

                                    </SelectContent>
                                </Select>
                            </FormItem>
                         )}
                        />
                        <Button
                            disabled={form.formState.isSubmitting}
                            type="submit"
                        >
                            {form.formState.isSubmitting ? <Loading/> : 'Save User Details'}
                        </Button>
                        
                        {authUserData?.role === 'OWNER' && (
                            <div>
                                <Separator className="my-4"/>
                                <FormLabel>User Permissions</FormLabel>
                                <FormDescription className="mb-4">
                                    You can give Sub Account access to team members by turning
                                    on access control for each sub account. This is only visible to agency owners.
                                </FormDescription>
                               
                            </div>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
     );
}
 
export default UserDetails;