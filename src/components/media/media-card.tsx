'use client'

import { Media } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Image from "next/image";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "../ui/use-toast";
import { deleteMedia, saveActivityLogsNotification } from "@/lib/queries";

type Props = {
    file: Media;
}
export default function MediaCard({ file }: Props) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return (
        <AlertDialog>
            <DropdownMenu>
                <article className="border w-full rounded-lg bg-slate-900">
                    <div className="relative w-full h-40">
                        <Image
                            src={file.link}
                            alt='Preview image'
                            fill
                            className='object-cover rounded-lg'
                        />
                    </div>
                    <p className="opacity-0 h-0 w-0">{file.name}</p>
                    <div className="p-4 relative">
                        <p className="text-muted-foreground">{file.createdAt.toDateString()}</p>
                        <p>{file.name}</p>
                        <div className="absolute top-4 right-4 p-[1px] cursor-pointer" onClick={() =>{}}>
                            <DropdownMenuTrigger>
                                <MoreHorizontal/>
                            </DropdownMenuTrigger>
                        </div>
                    </div>

                    <DropdownMenuContent>
                        <DropdownMenuLabel>Menu</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            className="flex gap-2"
                            onClick={() => {
                                navigator.clipboard.writeText(file.link)
                                toast({title: 'Copied to Clipboard'})
                            }}
                        > 
                            <Copy size={15}/> Copy Image Link
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="flex gap-2"
                                onClick={() =>{}}
                            >
                                <Trash size={15}/> Delete File
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </article>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">Are you absolutly sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                        Are you sure you wnat to delete this file? All subaccounts using this file will
                        no longer have access to the file!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        className="bg-destructive hover:bg-destructive"
                        onClick={async () =>{
                            setLoading(true)
                            const response = await deleteMedia(file.id)
                            await saveActivityLogsNotification({
                                agencyId: undefined,
                                description: `Deleted a media file | ${response?.name}`,
                                subaccountId: response.subAccountId,
                            })
                            toast({
                                title: 'File has been deleted',
                                description: `Sussesfully delete ${file.name}`
                            })
                            setLoading(false)
                            router.refresh()
                        }}

                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
