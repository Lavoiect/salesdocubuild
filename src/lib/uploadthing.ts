import { generateReactHelpers } from '@uploadthing/react/hooks'
import {OurFileRouter} from '@/app/api/uploadthing/core'
import { generateUploadButton } from "@uploadthing/react";
import { generateUploadDropzone } from "@uploadthing/react";

 


export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
 
export const UploadButton = generateUploadButton<OurFileRouter>();



