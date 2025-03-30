
import { Section } from "@prisma/client";
import { create } from "zustand";

interface GenerationState {
  clickedSection : Section | undefined
  setClickedSection : (section : Section) => void

  sectionState : Section[]
  setSectionState : (section : Section[]) => void

  addSection: (section: Section) => void
  upDateSection: (sectionId: string, title: string, description: string, videoUrl:string, isPublished: boolean) => void
  removeSection: (sectionId: string) => void
}

export const useGenerationStore = create<GenerationState>((set) => ({
  clickedSection: undefined,
  setClickedSection : (section : Section) => set(() => ({clickedSection : section})),
  
  sectionState : [],
  setSectionState : (section : Section[]) => set(() => ({sectionState : section})),

  addSection: (newSection: Section) => set((state) => ({sectionState: [...state.sectionState, newSection]})),

  upDateSection: (sectionId: string, title: string, description: string, videoUrl: string, isPublished: boolean) => set((state) => ({
    
    sectionState: state.sectionState.map(item => 
      
      item.id === sectionId ? {...item, title: title, description: description, videoUrl: videoUrl, isPublished: isPublished} : item
    )
    
  })),

  //TODO:Remove deleted Section
  removeSection : (sectionId: string) => 
    set(state => ({
      sectionState: state.sectionState.filter(section => section.id !== sectionId)
    })),
}))

