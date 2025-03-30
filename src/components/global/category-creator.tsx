'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "../ui/use-toast"
import { v4 } from "uuid"
import { AlertDialog,} from "../ui/alert-dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command"
import { PlusCircleIcon, TrashIcon, X } from "lucide-react"
import { Category } from "@prisma/client"
import { deleteCategory, getCategoriesForSubaccount, getCouresCategories, removeCourseCategory, saveActivityLogsNotification, updateCourseWithCategory, upsertCategory, upsertCourse } from "@/lib/queries"
import CategoryComponent from "./category"
import { set, sub } from "date-fns"
import { se } from "date-fns/locale"

type Props = {
    setCourseCategories: (categories: Category[]) => void
    selectedCategory: Category[]
    courseId: string
   // getSelectedCategory: (categories: Category[]) => void
    defaultCategories?: Category[]
    subaccountId: string
}
const categoryColors = ['BLUE', 'ORANGE', 'ROSE', 'PURPLE', 'GREEN'] as const
export type categoryColor = (typeof categoryColors)[number]

const CategoryCreator = ({setCourseCategories, selectedCategory, courseId, defaultCategories, subaccountId }: Props) => {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(defaultCategories || [])
    const [categories, setCategories] = useState<Category[]>([])
    const router = useRouter()
    const [value, setValue] = useState('')
    const [selectedColor, setSelectedColor] = useState('')

    useEffect(() => {
        setSelectedCategories(selectedCategory)
        console.log(selectedCategory)
    }, [selectedCategory])

    useEffect(() =>{
        if(courseId){
            const fetchData = async () => {
                const response = await getCategoriesForSubaccount(subaccountId)
                if(response) setCategories(response.Categories)
            }
            fetchData()
        }
    }, [courseId])

    
    

    const handleDeleteSelection = async (catId: string) => {
        try {
            setSelectedCategories(selectedCategories.filter((cat) => cat.id !== catId))
            const res = await removeCourseCategory(
                catId,
                courseId
            )
            console.log(selectedCategories)
            setCourseCategories(selectedCategories.filter((cat) => cat.id !== catId))
            return res
        }
        catch (error) {
            toast({
                variant: 'destructive',
                title: 'Opps',
                description: 'COuld not save ticket details'
            })
            
        }
    
    }

    const handleAddCategory = async () => {
        if(!value){
            toast({
                variant: 'destructive',
                title: 'Category needs to have a name'
            })
            return
        } 
        if(!selectedColor){
            toast({
                variant: 'destructive',
                title: 'Please select a color'
            })
            return
        }

        const categoryData: Category = {
            color: selectedColor,
            id: v4(),
            name: value,
            subAccountId: subaccountId
        }
        setCategories([...categories, categoryData])
        setValue('')
        setSelectedColor('')
        try {
            const response = await upsertCategory(subaccountId, categoryData)
            toast({
                title: 'created the Category'
            })
            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Upadated a tag | ${response?.name}`,
                subaccountId: subaccountId
            })
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Could not create tag'
            })
        }
    }

    const handleAddSelections = async (cateory: Category) => {
        if(selectedCategories.every((c) => c.id !== cateory.id)) {
            setSelectedCategories([...selectedCategories, cateory])
        }
        try{
        const res = await updateCourseWithCategory(
            cateory.id,
            courseId
        )
        setCourseCategories([...selectedCategories, cateory])
       // console.log(selectedCategories)  
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Opps',
            description: 'COuld not save ticket details'
        })
    }
    
    }

    const handleDeleteCategory = async (catId:string) => {
        setCategories(categories.filter((cat) => cat.id !== catId))
            try {
                const response = await deleteCategory(catId)
                toast({
                    title: 'Deleted Category',
                    description: 'the Category is deleted form your account'
                })

                await saveActivityLogsNotification({
                    agencyId: undefined,
                    description: `Deleted a category | ${response?.name}`,
                   // subaccountId: subAccountId
                })
                router.refresh()
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Could not delete tag'
                })
            }
    }
    return (
        <AlertDialog>
            <Command className="bg-transparent">
               
                {!!selectedCategories.length && (
                    <div className="flex flex-wrap gap-2 p-2 bg-background border-2 border-border rounded-md">
                        {selectedCategories.map((cat) => (
                            <div key={cat.id} className="flex items-center">
                                <CategoryComponent title={cat.name} colorName={cat.color}/> 
                                <X size={14} className="text-muted-foreground cursor-pointer" onClick={() => handleDeleteSelection(cat.id)}/>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-2 my-2 ml-2">
                    {categoryColors.map((colorName) => (
                        <CategoryComponent
                            key={colorName}
                            selectedColor={setSelectedColor}
                            title=""
                            colorName={colorName}
                            selectedColorName = {selectedColor}
                        />
                    ))}
                </div>
                <div className="relative">
                <CommandInput 
                    placeholder="Search or add tag..."
                    value={value}
                    onValueChange={setValue}
                />
                <PlusCircleIcon
                    onClick={handleAddCategory}
                    size={20}
                    className="absolute top-1/2 transform -translate-y-1/2 right-2 hover:text-primary transition-all cursor-pointer text-muted-foreground"
                />
                </div>
               <CommandList>
                    <CommandSeparator/>
                    <CommandGroup heading="Tags">
                        {categories.map((cat) => (
                            <CommandItem key={cat.id} className="hover:!bg-secondary !bg-transparent flex items-center justify-between !font-light cursor-pointer">
                                <div onClick={() => handleAddSelections(cat)}>
                                    <CategoryComponent title={cat.name} colorName={cat.color}/>
                                </div>
                                    <TrashIcon onClick={() => handleDeleteCategory(cat.id)} size={16} className="cursor-pointer text-muted-foreground hover:text-rose-400 transition-all"/>

                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandEmpty>No resluts</CommandEmpty>
               </CommandList>
            </Command>
        </AlertDialog>
    )
}

export default CategoryCreator
