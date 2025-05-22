'use client'
import { Info, Settings2, Trash } from 'lucide-react'
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import CreateWorkspaceForm from '@/components/forms/create-workspace-form'
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
  } from "@/components/ui/alert-dialog"
import { deleteWorkspace } from '@/lib/queries'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUserStore } from '@/lib/store/useUserStore'


  

type Props = {
    workspace: any
    agencyId:string
}

const Header = (props: Props) => {
        const router = useRouter()
       const { role } = useUserStore()
    

  const handleDelete = async (id: string) => {
        const res = await deleteWorkspace(id)
        if(res){
            toast({
                title: 'Workspace deleted',
                description: 'Workspace deleted successfully',
                variant: 'default'
            })
            
        }
        router.refresh()
    }
    return (
        <div className='flex items-center justify-between w-full'>
            <div className='text-lg text-primary font-bold flex items-center'>
                {props.workspace.name} : role {role}
                <HoverCard>
                    <HoverCardTrigger><Info size={20} className='text-primary ml-1' /></HoverCardTrigger>
                    <HoverCardContent>
                        <div className='text-sm text-muted-foreground'>
                        {props.workspace.description ? props.workspace.description : 'No description'}  
                        </div>
                    </HoverCardContent>
                </HoverCard> 
            </div>
            <div className='flex items-center'>
                <Popover modal>
                    <PopoverTrigger>
                        <Settings2 size={20} className='mr-1 text-slate-400' />
                    </PopoverTrigger>
                    <PopoverContent className='w-[500px] scroll-auto'>
                        <ScrollArea className={"[&>[data-radix-scroll-area-viewport]]:max-h-[400px]"}>
                        <div>
                            <CreateWorkspaceForm agencyId={props.agencyId} defaultData={props.workspace}/>
                        </div>
                        </ScrollArea>
                       
                    </PopoverContent>
                </Popover>
                <AlertDialog>
  <AlertDialogTrigger><Trash size={20} className='text-red-400 mr-1' /></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => handleDelete(props.workspace.id)}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

                
            </div>
        </div>

    )
}

export default Header