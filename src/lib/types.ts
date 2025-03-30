import { Contact, Lane, Notification, Prisma, Role, Tag, Ticket, User } from "@prisma/client";
import { getAuthUserDetails, getCourses, getFunnels, getLanesWithTicketAndTags, getMedia, getPipelineDetails, getTicketsWithTags, getUserPermissions } from "./queries";
import { type } from "os";
import { db } from "./db";
import { z } from "zod";
import { title } from "process";
import { is } from "date-fns/locale";


export type NotificationWithUser =
    | ({
        User: {
            id: string
            name: string
            avatarUrl: string
            email: string
            createdAt: string
            updatedAt: string
            role: Role
            agencyId: string | null
        }
    } & Notification)[]
    | undefined

const __getUsersWithAgencySubAccountPermissionsSideBarOptions = async (
    agencyId: string
) => {
    return await db.user.findFirst({
        where: { Agency: { id: agencyId } },
        include: {
            Agency: { include: { SubAccount: true } },
            Permissions: { include: { SubAccount: true } }
        }
    })
}


export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<typeof getUserPermissions>

export type AuthUserWithAgencySideBarOptionsandSubAccounts = Prisma.PromiseReturnType<typeof getAuthUserDetails>

export type UsersWithAgencySubAccountPermissionsSidebarOptions =
    Prisma.PromiseReturnType<typeof __getUsersWithAgencySubAccountPermissionsSideBarOptions>

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>

export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput


export type TicketAndTags = Ticket & {
    Tags: Tag[];
    Assigned: User | null;
    Customer: Contact | null
}

export type LaneDetails = Lane & {
    Tickets: TicketAndTags[]
}

export const CreatePipelineFormSchema = z.object({
    name: z.string().min(1),
})

export const CreateLaneFormSchema = z.object({
    name: z.string().min(1),
})

export const CreateDocumentFormSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    subDomainName: z.string().optional(),
    favicon: z.string().optional(),

})

export const CreateWorkspaceFormSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    subDomainName: z.string().optional(),
    favicon: z.string().optional(),
})





export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<typeof getPipelineDetails>
export type TicketWithTags = Prisma.PromiseReturnType<typeof getTicketsWithTags>


const currencyNumberRegex = /^\d+(\.\d{1,2})?$/

export const TicketFormSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    value: z.string().refine((value) => currencyNumberRegex.test(value), {
        message: 'Value must be a valid price'
    })
})

export const ContactUserFormSchema = z.object({
    name: z.string().min(1, 'Required'),
    email: z.string().email(),
})

export const ContactUsFormSchema = z.object({
    name: z.string().min(1, 'Required'),
    email: z.string().email(),
})

export const FunnelPageSchema = z.object({
    name: z.string().min(1),
    pathName: z.string().optional(),
})
export const CourseSectionSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    videoUrl: z.string().min(10),
    isPublished: z.boolean().optional(),
})



export type FunnelsForSubAccount = Prisma.PromiseReturnType<typeof getFunnels>[0]

export type CoursesForSubAccount = Prisma.PromiseReturnType<typeof getCourses>[0]


export type UpsertDocumentPage = Prisma.DocumentPageCreateWithoutDocumentInput

