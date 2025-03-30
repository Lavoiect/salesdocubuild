"use server"

import { clerkClient, currentUser } from "@clerk/nextjs"
import { db } from "./db";
import { redirect } from "next/navigation";
import { Agency, Plan,Role, User } from "@prisma/client";
import { v4 } from "uuid";
import { CreateDocumentFormSchema, CreateMediaType, CreateWorkspaceFormSchema, UpsertDocumentPage} from "./types";
import { z } from "zod";

import { revalidatePath } from "next/cache";


export const getAuthUserDetails =async () => {
    const user = await currentUser();

    if(!user){
        return
    };

    const userData = await db.user.findUnique({
        where: {
            email: user.emailAddresses[0].emailAddress,
        },
        include: {
            Agency: {
        
            },
            
        }
    })
    return userData;
}

export const saveActivityLogsNotification = async ({
    agencyId,
    description,
}: {
    agencyId?: string,
    description: string,
    
}) => {
    const authUser = await currentUser()
    let userData;
    if(!authUser){
        const response = await db.user.findFirst({
            where: {
                Agency: {
                   
                }
            }
        })
        if(response){
            userData = response
        }
    } else {
        userData = await db.user.findUnique({
            where: {
                email: authUser?.emailAddresses[0].emailAddress
            },
        })
    }
    if(!userData){
        console.log("Could not find a user")
        return
    }
    let foundAgencyId = agencyId
    if(!foundAgencyId){
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}}`,
                User: {
                    connect: {
                        id: userData.id
                    },
                },
                Agency: {
                    connect: {
                        id: foundAgencyId,
                    }
                }
            }
        })
    }
}

export const createTeamUser =async (agencyId:string, user: User) => {
   if(user.role === "AGENCY_OWNER") {
    return null
   }
   const response = await db.user.create({data: {...user}})
   return response
}

export const verifyAndAcceptInvitation = async () => {
   const user = await currentUser()
    if(!user){
        return redirect('/sign-in');
    }
    const invitationExists = await db.invitation.findUnique({
        where: {
            email: user.emailAddresses[0].emailAddress,
            status: "PENDING"
        }
    });

    if(invitationExists){
        const userDetails = await createTeamUser(invitationExists.agencyId, {
            email: invitationExists.email,
            agencyId: invitationExists.agencyId,
            avatarUrl: user.imageUrl,
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role: invitationExists.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        await saveActivityLogsNotification({
            agencyId: invitationExists?.agencyId,
            description: `Joined`,
           
        })

        if(userDetails){
            await clerkClient.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    role: userDetails.role || 'SUBACCOUNT_USER',
                },
            })

            await db.invitation.delete({
                where: {email: userDetails.email}
            })

            return userDetails.agencyId
        } else return null
    } else {
        const agency = await db.user.findUnique({
            where: {
                email: user.emailAddresses[0].emailAddress
            },
        })
        return agency ? agency.agencyId : null
    }
}

export const updateAgencyDetails = async (agencyId:string, agencyDetails: Partial<Agency>) => {
    const response = await db.agency.update({
        where: {
            id: agencyId
        },
        data: {...agencyDetails},
    })
    return response
}






export const deleteAgency =async (agencyId:string) => {
    const response = await db.agency.delete({
        where: {
            id: agencyId
        }
    })
    return response;
}

export const initUser =async (newUser: Partial<User>) => {
    const user = await currentUser()
    if(!user) return

    const userData = await db.user.upsert({
        where: {
            email: user.emailAddresses[0].emailAddress,
        },
        update: newUser,
        create: {
            id: user.id,
            avatarUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            role: newUser.role || 'SUBACCOUNT_USER'
        }
    })

    await clerkClient.users.updateUserMetadata(user.id , {
        privateMetadata: {
            role: newUser.role || 'SUBACCOUNT_USER',

        },
    })
    return userData;
}

export const upsertAgency =async (agency: Agency, price?: Plan) => {
    if(!agency.companyEmail) return null
    try {
        const agencyDetails = await db.agency.upsert({
            where: {
                id: agency.id,
            },
            update: agency,
            create: {
                users: {
                    connect: {email: agency.companyEmail},
                },
                ...agency,
               
            }
        })
        return agencyDetails;
    } catch (error) {
        
    }
}

export const getNotificationsAndUser =async (agencyId:string) => {
    try {
        const response = await db.notification.findMany({
            where: {agencyId},
            include: {User: true},
            orderBy: {
                createdAt: 'desc'
            },
        })
        return response
    } catch (error) {
        console.log(error)
    }
}





export const updateUser = async (user: Partial<User>) => {

    const response = await db.user.update({
        where: {email: user.email},
        data: {...user}
    });

    await clerkClient.users.updateUserMetadata(response.id, {
        privateMetadata: {
            role: user.role || "SUBACCOUNT_USER",
        },
    });
    return response
}







export const deleteUser = async (userId: string) => {
    await clerkClient.users.deleteUser(userId)
   // await clerkClient.users.updateUserMetadata(userId, {
       // privateMetadata: {
        //    role: undefined
      //  },
  //  })
    const deletedUser = await db.user.delete({where: {id: userId}})

    return deletedUser
}

export const getUser = async (id: string) => {
    const user = await db.user.findUnique({
        where: {
            id,
        }
    })
    return user
}

export const sendInvitation = async (
    role: Role,
    email: string,
    agencyId: string
) => {
    const response = await db.invitation.create({
        data: {email, agencyId, role},
    })

    try {
        const invitation = await clerkClient.invitations.createInvitation({
            emailAddress: email,
            redirectUrl: process.env.NEXT_PUBLIC_URL,
            publicMetadata: {
                throughInvitation: true,
                role,
            },
        })
    } catch (error) {
        console.log(error)
    }
    return response
}

export const getMedia =async (subaccountId:string) => {
    const mediafiles = await db.agency.findUnique({
        where: {
            id: subaccountId,
        },
        include: {Media: true}
    })
    return mediafiles
}

export const createMedia =async (subaccountId:string, mediaFile: CreateMediaType) => {
    const response = await db.media.create({
        data: {
            link: mediaFile.link,
            name: mediaFile.name,
            agencyId: subaccountId
        }
    })

    return response
}

export const deleteMedia =async (mediaId:string) => {
    const response = await db.media.delete({
        where: {
            id: mediaId
        }
    })
    return response
}



export const upsertDocument = async (
    workspaceId : string,
    document: z.infer<typeof CreateDocumentFormSchema>,
    documentId: string,
    documentPageContent?: string
) => {
    const response = await db.document.upsert({
        where: {id: documentId},
        update: document,
        create: {
            ...document,
            id: documentId || v4(),
            workspaceId: workspaceId
        }
    })
    upsertDocumentPage(
        { 
            name: 'Page One',
            id: v4(),
            order: 0,
            pathName: '',
            content: documentPageContent,
            
          },
        documentId)
    return response
}

export const upsertDocumentFromTemplate = async (
    workspaceId : string,
    document: z.infer<typeof CreateDocumentFormSchema>,
    documentId: string,
    documentPageId?: string
) => {
    const response = await db.document.upsert({
        where: {id: documentId},
        update: document,
        create: {
            ...document,
            id: documentId || v4(),
            workspaceId: workspaceId
        }
    })

    if(documentPageId){
       // console.log(documentId)
        const documentPage = await getFunnel(documentPageId)
        console.log(documentPage)
        if(documentPage){
            upsertDocumentPage(
                { 
                    name: 'page one',
                    id: v4(),
                    order: 0,
                    pathName: '',
                    content: documentPage.DocumentPages[0].content,
                    
                  },
                documentId)
        }
    }
    
    return response
}

export const upsertWorkspace = async (
    agencyId : string,
    workspace: z.infer<typeof CreateWorkspaceFormSchema>,
    workspaceId: string
) => {
    const response = await db.workspace.upsert({
        where: {id: workspaceId},
        update: workspace,
        create: {
            ...workspace,
            id: workspaceId || v4(),
            type: 'Workspace',
            agencyId: agencyId
        }
    })
    return response
}

export const upsertTemplate = async (
    agencyId : string,
    workspace: z.infer<typeof CreateWorkspaceFormSchema>,
    workspaceId: string
) => {
    const response = await db.workspace.upsert({
        where: {id: workspaceId},
        update: workspace,
        create: {
            ...workspace,
            id: workspaceId || v4(),
            type: 'Template',
            agencyId: agencyId
        }
    })
    return response
}


export const getDocuments = async (workspaceId:string) => {
    const documents = await db.document.findMany({
        where: {workspaceId: workspaceId},
        include: {DocumentPages: true}
    })
    
    return documents
}

export const getTemplates = async (agencyId:string) => {
    const templates = await db.workspace.findMany({
        where: {agencyId: agencyId, type: 'Template'},
        include: {
            Documents: true
        }
    })
    console.log(templates)
    return templates
}

export const getWorkspaces = async (agencyId:string) => {
    const workspaces = await db.workspace.findMany({
        where: {agencyId: agencyId},
       include: { 
            Documents: {
                include: {
                    DocumentPages: true
                }
            }
         }
    })
    
    return workspaces
}



export const getFunnel = async (funnelId:string) => {
    const funnel = await db.document.findUnique({
        where: {
            id: funnelId
        },
        include: {
            DocumentPages: {
                orderBy: {
                    order: 'asc'
                }
            }
        }
        
    })
    return funnel
}


export const upsertDocumentPage = async (
    documentPage: UpsertDocumentPage,
    documentId: string
) => {
    if(!documentPage || !documentId){
        return
    }
    const res = await db.documentPage.upsert({
        where: {id: documentPage.id || ''},
        update: {...documentPage},
        create: {
            ...documentPage,
            content: documentPage.content
            ? documentPage.content
            : JSON.stringify([
               { content: [],
                id: '__body',
                name: 'Body',
                styles: {backgroundColor: 'white'},
                type: '__body'
            },
            ]),
            documentId,
        }
    })
    //revalidatePath(`/subaccount/${agencyId}/funnels/${funnelId}`, 'page')
    return res
}

export const deleteFunnelPage = async (funnelPageId: string) => {
    const res = await db.documentPage.delete({where: {id: funnelPageId}})
    return res
}


export const getDocumentPageDetails =async (documentPageId:string) => {
    const res = await db.documentPage.findUnique({
        where: {
            id: documentPageId
        }
    })
    return res
}

export const getDomainContent = async (subDomainName: string) => {
    const res = await db.document.findUnique({
        where:{
            subDomainName
        },
        include: {
            DocumentPages: true
        }
    })
    return res
}
