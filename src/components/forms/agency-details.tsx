"use client"
import { Agency } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'


import * as z from 'zod'
import { useForm } from "react-hook-form";
import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { deleteAgency, initUser, saveActivityLogsNotification, updateAgencyDetails, upsertAgency } from "@/lib/queries";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { v4 } from "uuid";



type Props = {
  data?: Partial<Agency>
}

const FormSchema = z.object({
    name: z.string().min(2, {message: 'Agency name must be atleast 2 charaters'}),
    companyEmail: z.string().min(1),
    companyPhone: z.string().min(1),
    whiteLabel: z.boolean(),
    address: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    agencyLogo: z.string().min(1),
})

const AgencyDetails = ({ data } : Props) => {
  const {toast} = useToast()



  const router = useRouter()
  const [deletingAgency, setDeletingAgency] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name, // add || "" to clear error
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      agencyLogo: data?.agencyLogo,
    }
  })

  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    if(data){
      form.reset(data)
    }
  }, [data])

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let newUserData;
      let customerId;
      if(!data?.id){
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode,
          }
        }
      }
      newUserData = await initUser({role: 'OWNER'})
     // if(!data?.customerId && !custId)return
        const response = await upsertAgency({
          id: data?.id ? data.id : v4(),
          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
        })
        toast({
          title: "Created Agency",
        })
        if(data?.id) return router.refresh()
        if(response){
          return router.refresh()
        }
      
    } catch (error) {
      console.log(error)
      toast({
        title: "Opps didnt work",
        description: "Deleted your agency and all subaccounts."
      })
    }
  }

  const handleDeleteAgency =async () => {
    if(!data?.id) return
    setDeletingAgency(true)
    //WIP: discontinue the subscription
    try {
      const response = await deleteAgency(data.id)
      toast({
        title: "Deleted Agency",
        description: "Deleted your agency and all subaccounts."
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Opps",
        description: "Could not deleted your agency, please contact tech support for more information."
      })
    }
    setDeletingAgency(false)
  }

  return ( 
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for your business. You can edit agency information later from the settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField 
                      disabled={isLoading}
                      control={form.control}
                      name="agencyLogo"
                      render={({field}) => (
                      <FormItem>
                        <FormLabel>Agency Logo</FormLabel>
                        <FormControl>
                            <FileUpload
                              apiEndpoint="agencyLogo"
                              onChange={field.onChange}
                              value={field.value}
                            />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                      )} 
                    />
                  <div className="flex md:flex-row gap-4">
                        <FormField 
                          
                          control={form.control}
                          name="name"
                          render={({field}) =>(
                            <FormItem className="flex-1">
                              <FormLabel>Agency Name:</FormLabel>
                              <FormControl>
                                <Input 
                                placeholder="Your agency name"
                                {...field}
                                disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        
                        />

                        <FormField 
                         
                          control={form.control}
                          name="companyEmail"
                          render={({field}) =>(
                            <FormItem className="flex-1">
                              <FormLabel>Company Email:</FormLabel>
                              <FormControl>
                                <Input
                                  readOnly 
                                  placeholder="Email"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        
                        />
                            
                        
                  </div>
                  <FormField 
                          
                          control={form.control}
                          name="companyPhone"
                          render={({field}) =>(
                            <FormItem className="flex-1">
                              <FormLabel>Company Phone Number:</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="(123)456-7890"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        
                        />
                        <FormField 
                         
                          control={form.control}
                          name="whiteLabel"
                          render={({field}) =>(
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                                <div>
                                  <FormLabel>Whitelabel Company</FormLabel>
                                  <FormDescription>
                                      Turning on whitelabel mode will show yoour company logo to all sub accounts by default. You can overwith this
                                      through the sub account settings.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                            </FormItem>
                          )}
                        
                        />
                      <FormField 
                         
                          control={form.control}
                          name="address"
                          render={({field}) =>(
                            <FormItem className="flex-1">
                              <FormLabel>Street Address:</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Main Street"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        
                        />

                    <div className="flex md:flex-row gap-4">
                        <FormField 
                          
                          control={form.control}
                          name="city"
                          render={({field}) =>(
                            <FormItem className="flex-1">
                              <FormLabel>City:</FormLabel>
                              <FormControl>
                                <Input 
                                placeholder="City"
                                {...field}
                                disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        
                        />

                        <FormField 
                          
                          control={form.control}
                          name="state"
                          render={({field}) =>(
                            <FormItem className="flex-1">
                              <FormLabel>State:</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="State"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        
                        />

                      <FormField 
                          
                          control={form.control}
                          name="zipCode"
                          render={({field}) =>(
                            <FormItem className="flex-1">
                              <FormLabel>Zipcode:</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ZipCode"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        
                        />
                            
                        
                  </div>
                  <FormField 
                          
                          control={form.control}
                          name="country"
                          render={({field}) =>(
                            <FormItem className="flex-1">
                              <FormLabel>Country:</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Country"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        
                        />

                 <Button 
                  type="submit"
                  disabled={isLoading}
                 >
                  {isLoading ? <Loading/> : "Save Agency Information"}</Button>
              </form>
          </Form>

               {data?.id && (<div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                            <div>
                                <div>Danger Zone</div>
                            </div>
                            <div className="text-muted-foreground">Deleting your agency cannot be undone. This will also delete all sub accounts and all data realated to you sub accounts.</div>
                            <AlertDialogTrigger
              disabled={isLoading || deletingAgency}
              className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
            >
              {deletingAgency ? 'Deleting...' : 'Delete Agency'}
              </AlertDialogTrigger>    
                </div>
                
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will paremtlu delte the Agency account and all related subaccounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
            
        </CardContent>
      </Card>
    </AlertDialog>
   );
}
 
export default AgencyDetails;