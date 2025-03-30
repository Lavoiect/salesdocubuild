import { Category, Course, Section } from "@prisma/client";
import { string } from "zod";
import { create } from "zustand";

interface GenerationState {
    courseState : (Course & { Categories: Category[], Sections: Section[] })[] | null
    
    setCourseState : (course : (Course & { Categories: Category[], Sections: Section[] })[]) => void

    upDateCourse: (id: string, title: string, description: string, imageUrl:string, isPublished: boolean, Sections: { id: string, title: string, description: string, videoUrl: string, position: number, isPublished: boolean, courseId: string, createdAt: Date, updatedAt: Date }[]) => void

    clickedSection : Section | undefined
    setClickedSection : (course : (Course & { Categories: Category[], Sections: Section[] })[]) => void

    sectionState : Section[]
    setSectionState : (section : Section[]) => void

    addSection: (section: Section) => void
    upDateSection: (sectionId: string, title: string, description: string, videoUrl:string, isPublished: boolean) => void
    removeSection: (sectionId: string) => void

}

export const useGenerationStore = create<GenerationState>((set) => ({

    clickedSection: undefined,
    setClickedSection : (course : (Course & { Categories: Category[], Sections: Section[] })[]) => set(() => ({ courseState: course as any })),
  
    sectionState : [],
    setSectionState : (section : Section[]) => set(() => ({sectionState : section})),

    addSection: (newSection: Section) => set((state) => ({sectionState: [...state.sectionState, newSection]})),

    upDateSection: (sectionId: string, title: string, description: string, videoUrl: string, isPublished: boolean) => set((state) => ({
    
    sectionState: state.sectionState.map(item => 
      
      item.id === sectionId ? {...item, title: title, description: description, videoUrl: videoUrl, isPublished: isPublished} : item
    )
    
  })),

  removeSection : (sectionId: string) => 
    set(state => ({
      sectionState: state.sectionState.filter(section => section.id !== sectionId)
    })),

    courseState : null,
    setCourseState : (course : (Course & { Categories: Category[], Sections: Section[] })[]) => set(() => ({ courseState: course as any })),


    upDateCourse: (id: string, title: string, description: string, imageUrl:string, isPublished: boolean, Sections: {id: string, title: string, description: string, videoUrl: string, position: number, isPublished: boolean, courseId: string, createdAt: Date, updatedAt: Date}[]) => set((state) => ({
        courseState: state.courseState?.map(item => 
            item.id === id ? {...item, title, description, imageUrl, isPublished, Sections: Sections.map(section => ({...section}))} : item
        )
    })),
}))