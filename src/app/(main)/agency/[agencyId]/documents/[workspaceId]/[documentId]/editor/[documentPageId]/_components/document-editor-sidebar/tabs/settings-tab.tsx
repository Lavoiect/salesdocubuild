'use client'
import React, { ChangeEventHandler } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  ChevronsLeftRightIcon,
  Divide,
  LayoutGrid,
  Link,
  LucideImageDown,
  Paintbrush,
  Ruler,
} from 'lucide-react'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWebEditor } from '@/providers/editor/editor-provider'
import { Slider } from '@/components/ui/slider'


type Props = {}

const SettingsTab = (props: Props) => {
  const { state, dispatch } = useWebEditor()

  const handleOnChanges = (e: any) => {
    const styleSettings = e.target.id
    let value = e.target.value
    const styleObject = {
      [styleSettings]: value,
    }

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    })
  }

  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id
    let value = e.target.value
    const styleObject = {
      [settingProperty]: value,
    }

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    })
  }

  return (
    state.editor.selectedElement.type !== 'text' ? (
      <Accordion
      type="multiple"
      className="w-full"
      defaultValue={['Typography', 'Dimensions', 'Decorations', 'Flexbox']}
    >
      
      <AccordionItem
        value="Custom"
        className="px-6 py-0  "
      >
         
        <AccordionTrigger className="!no-underline"><div className='flex items-center gap-2'><Link size={20} className='text-muted-foreground'/>Link</div></AccordionTrigger>   
        <AccordionContent>
         
             {state.editor.selectedElement.type === 'video' &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Video Link</p>
                <Input
                  id="src"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.src}
                />
              </div>
            )}
             {state.editor.selectedElement.type === 'image' &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Image Link</p>
                <Input
                  id="src"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.src}
                />
              </div>
            )}
            {state.editor.selectedElement.type === 'link' &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Link</p>
                <Input
                  id="href"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.href}
                />
              </div>
            )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Dimensions"
        className=" px-6 py-0 "
      >
        <AccordionTrigger className="!no-underline">
        <div className='flex items-center gap-2'><Ruler size={20} className='text-muted-foreground'/>Dimensions</div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground text-base">Height</Label>
                    
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                      id="height"
                      className="!border-0 rounded-none !border-r-0"
                      placeholder="Value"
                      onChange={(e) => {
                      handleOnChanges({
                        target: {
                        id: 'height',
                        value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                        },
                      })
                      }}
                      value={typeof state.editor.selectedElement.styles.height === 'string' 
                        ? state.editor.selectedElement.styles.height.replace('px', '') 
                        : state.editor.selectedElement.styles.height ||
                        ''}
                    />
                    <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                    </div>
                    
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-base">Width</Label>
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                      className="!border-0 rounded-none !border-r-0"
                      placeholder="Value"
                      id="width"
                      onChange={(e) => {
                        handleOnChanges({
                          target: {
                          id: 'width',
                          value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                          },
                        })
                        }}
                        value={typeof state.editor.selectedElement.styles.width === 'string' 
                          ? state.editor.selectedElement.styles.width.replace('px', '') 
                          : state.editor.selectedElement.styles.width ||
                          ''}
                    />
                   <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                    </div>
                    
                  </div>
                </div>
              </div>
              <p className='mt-4 text-muted-foreground text-base'>Margin</p>
              <div className="flex items-center gap-2 mt-4 mb-2">
            <Input
              className="h-4 w-4"
              placeholder="px"
              type="checkbox"
              id="margin"
              onChange={(va) => {
                handleOnChanges({
                  target: {
                    id: 'margin',
                    value: va.target.checked ? 'auto' : 0,
                  },
                })
              }}
              checked={
                state.editor.selectedElement.styles.margin === 'auto'
              }
            />
            <Label className="text-muted-foreground">Center Element</Label>
          </div>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                      id="marginTop"
                      className="!border-0 rounded-none !border-r-0"
                      placeholder="Value"
                      onChange={(e) => {
                        handleOnChanges({
                          target: {
                          id: 'marginTop',
                          value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                          },
                        })
                        }}
                        value={typeof state.editor.selectedElement.styles.marginTop === 'string' 
                          ? state.editor.selectedElement.styles.marginTop.replace('px', '') 
                        : state.editor.selectedElement.styles.marginTop ||
                         ''}
                        
                      />
                     <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                    </div>
                   
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                     className="!border-0 rounded-none !border-r-0"
                      placeholder="Value"
                      id="marginBottom"
                      onChange={(e) => {
                        handleOnChanges({
                          target: {
                          id: 'marginBottom',
                          value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                          },
                        })
                        }}
                        value={typeof state.editor.selectedElement.styles.marginBottom === 'string' 
                          ? state.editor.selectedElement.styles.marginBottom.replace('px', '') 
                          : state.editor.selectedElement.styles.marginBottom ||
                          ''}
                    />
                    <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                    </div>
                   
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    
                    <Label className="text-muted-foreground">Left</Label>
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                      className="!border-0 rounded-none !border-r-0"

                      placeholder="Value"
                      id="marginLeft"
                      onChange={(e) => {
                        handleOnChanges({
                          target: {
                          id: 'marginLeft',
                          value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                          },
                        })
                        }}
                        value={typeof state.editor.selectedElement.styles.marginLeft === 'string' 
                          ? state.editor.selectedElement.styles.marginLeft.replace('px', '') 
                          : state.editor.selectedElement.styles.marginLeft ||
                          ''}
                    />
                     <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                    </div>
                    
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                     className="!border-0 rounded-none !border-r-0"
                      placeholder="Value"
                      id="marginRight"
                      onChange={(e) => {
                        handleOnChanges({
                          target: {
                          id: 'marginRight',
                          value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                          },
                        })
                        }}
                        value={typeof state.editor.selectedElement.styles.marginRight === 'string' 
                          ? state.editor.selectedElement.styles.marginRight.replace('px', '') 
                          : state.editor.selectedElement.styles.marginRight ||
                          ''}
                    />
                     <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className='mt-4 text-muted-foreground text-base'>Padding</div>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                      className="!border-0 rounded-none !border-r-0"
                      placeholder="px"
                      id="paddingTop"
                      onChange={(e) => {
                        handleOnChanges({
                          target: {
                          id: 'paddingTop',
                          value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                          },
                        })
                        }}
                        value={typeof state.editor.selectedElement.styles.paddingTop === 'string' 
                          ? state.editor.selectedElement.styles.paddingTop.replace('px', '') 
                          : state.editor.selectedElement.styles.paddingTop ||
                          ''}
                    />
                     <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                    </div>
                    
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                      className="!border-0 rounded-none !border-r-0"
                      placeholder="px"
                      id="paddingBottom"
                      onChange={(e) => {
                        handleOnChanges({
                          target: {
                          id: 'paddingBottom',
                          value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                          },
                        })
                        }}
                        value={typeof state.editor.selectedElement.styles.paddingBottom === 'string' 
                          ? state.editor.selectedElement.styles.paddingBottom.replace('px', '') 
                          : state.editor.selectedElement.styles.paddingBottom ||
                          ''}
                    />
                     <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                      className="!border-0 rounded-none !border-r-0"
                      placeholder="Value"
                      id="paddingLeft"
                      onChange={(e) => {
                        handleOnChanges({
                          target: {
                          id: 'paddingLeft',
                          value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                          },
                        })
                        }}
                        value={typeof state.editor.selectedElement.styles.paddingLeft === 'string' 
                          ? state.editor.selectedElement.styles.paddingLeft.replace('px', '') 
                          : state.editor.selectedElement.styles.paddingLeft ||
                          ''}
                    />
                     <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                  </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <div className='flex rounded-md border border-spacing-1 overflow-clip gap-1 mt-1'>
                    <Input
                      className="!border-0 rounded-none !border-r-0"
                      placeholder="Value"
                      id="paddingRight"
                      onChange={(e) => {
                        handleOnChanges({
                          target: {
                          id: 'paddingRight',
                          value: e.target.value.endsWith('px') ? e.target.value : `${e.target.value}px`,
                          },
                        })
                        }}
                        value={typeof state.editor.selectedElement.styles.paddingRight === 'string' 
                          ? state.editor.selectedElement.styles.paddingRight.replace('px', '') 
                          : state.editor.selectedElement.styles.paddingRight ||
                          ''}
                    />
                     <div className='bg-slate-200 p-2 text-muted-foreground'>
                       px
                    </div>
                    </div>
                   
                    </div>
                  </div>
                
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Decorations"
        className="px-6 py-0 "
      >
        <AccordionTrigger className="!no-underline">
        <div className='flex items-center gap-2'><Paintbrush size={20} className='text-muted-foreground'/>Decorations</div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <div className='mb-2'>

         
             
              
              {state.editor.selectedElement.type === 'button' &&
              
            !Array.isArray(state.editor.selectedElement.content) && (
              
              <div className="flex flex-col gap-2">
                          <div className='mt-4 mb-4 text-muted-foreground text-base'>Button Options</div>

                <p className="text-muted-foreground">Color</p>
                <Input
                  id="bgColor"
                  placeholder="Color"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.bgColor}
                />
              </div>
            )}
             
              <div className="flex border-[1px] rounded-md overflow-clip">
             
             {state.editor.selectedElement.type === 'button' &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Hover Color</p>
                <Input
                  id="hoverColor"
                  placeholder="Color"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.hoverColor}
                />
              </div>
            )}
              </div>
          
          
          </div>
          <div className='mb-2'>
            <Label className="text-muted-foreground">Opacity</Label>
            <div className="flex items-center justify-end">
              <small className="p-1">
                {typeof state.editor.selectedElement.styles?.opacity ===
                'number'
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.opacity || '100'
                      ).replace('%', '')
                    ) || 0}
                %
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: 'opacity',
                    value: `${e[0]}%`,
                  },
                })
              }}
              value={[
                typeof state.editor.selectedElement.styles?.opacity === 'string'
                  ? parseFloat(state.editor.selectedElement.styles?.opacity.replace('%', '')) || 100
                  : state.editor.selectedElement.styles?.opacity || 100,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div className='mb-3'>
            <Label className="text-muted-foreground">Border Radius</Label>
            <div className="flex items-center justify-end">
              <small className="p-1">
                {typeof state.editor.selectedElement.styles?.borderRadius ===
                'number'
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                      state.editor.selectedElement.styles?.borderRadius?.replace('px', '') || '0'
                    )}
                px
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: 'borderRadius',
                    value: `${e[0]}%`,
                  },
                })
              }}
              value={[
                typeof state.editor.selectedElement.styles?.borderRadius === 'string'
                  ? parseFloat(state.editor.selectedElement.styles?.borderRadius.replace('%', '')) || 0
                  : state.editor.selectedElement.styles?.borderRadius || 0,
              ]}
              max={100}
              step={1}
            />
              </div>
{/*
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Border Color</Label> 
            <div className="flex  border-[1px] rounded-md overflow-clip">
              <div
                className="w-12"
                style={{
                  borderColor:
                    state.editor.selectedElement.styles.borderColor,
                }}
              />
              <Input
              type='color'
                placeholder="#HFI245"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="borderColor"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.borderColor}
              />
            </div>
         
          </div>
          
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Border Width</Label> 
            <div className="flex  border-[1px] rounded-md overflow-clip">
              
              <Input
              
                placeholder="Value"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="borderWidth"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.borderWidth}
              />
            </div>
         
          </div>
          */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Color</Label>
            <div className="flex  border-[1px] rounded-md overflow-clip">
              <div
                className="w-12"
                style={{
                  backgroundColor:
                    state.editor.selectedElement.styles.backgroundColor,
                }}
              />
              <Input
              type='color'
                placeholder="#HFI245"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="backgroundColor"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.backgroundColor ||
                  ''}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Image</Label>
            <div className="flex border-[1px] rounded-md overflow-clip">
              <div
                className="w-12 "
                style={{
                  backgroundImage:
                   state.editor.selectedElement.styles.backgroundImage,
                }}
              />
              <Input
                placeholder="https:domain.example.com/pathname"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="backgroundImage"
                onChange={(e) =>
                  handleOnChanges({
                  target: {
                    id: 'backgroundImage',
                    value: e.target.value.startsWith('url(') ? e.target.value : `url(${e.target.value})`,
                  },
                  })
                }
                value={
                  state.editor.selectedElement.styles.backgroundImage?.replace(
                    /^url\((['"]?)(.*?)\1\)$/,
                    '$2'
                  ) || ''
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Image Position</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'backgroundSize',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.backgroundSize?.toString()}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TabsTrigger
                  value="cover"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <ChevronsLeftRightIcon size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="contain"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignVerticalJustifyCenter size={22} />
                </TabsTrigger>
                <TabsTrigger
                  value="auto"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <LucideImageDown size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Flexbox"
        className="px-6 py-0  "
      >
        <AccordionTrigger className="!no-underline">
        <div className='flex items-center gap-2'><LayoutGrid size={20} className='text-muted-foreground'/>Flexbox</div>
          </AccordionTrigger>
        <AccordionContent>
          <Label className="text-muted-foreground">Justify Content</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: 'justifyContent',
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.justifyContent}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              <TabsTrigger
                value="space-between"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignHorizontalSpaceBetween size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="space-evenly"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignHorizontalSpaceAround size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="center"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignHorizontalJustifyCenterIcon size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="start"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
              >
                <AlignHorizontalJustifyStart size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="end"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
              >
                <AlignHorizontalJustifyEndIcon size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Label className="text-muted-foreground">Align Items</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: 'alignItems',
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.alignItems}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              <TabsTrigger
                value="center"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignVerticalJustifyCenter size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="normal"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
              >
                <AlignVerticalJustifyStart size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 mt-4 mb-">
            <Input
              className="h-4 w-4"
              placeholder="px"
              type="checkbox"
              id="display"
              
              onChange={(va) => {
                handleOnChanges({
                  target: {
                    id: 'display',
                    value: va.target.checked ? 'flex' : 'block',
                  },
                })
                
              }}
              checked={
                state.editor.selectedElement.styles.display === 'flex'
              }
            />
            <Label className="text-muted-foreground">Flex</Label>
          </div>
          <div className='mt-4'>
            <Label className="text-muted-foreground"> Direction</Label>
            <Input
              placeholder="Value"
              id="flexDirection"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.flexDirection ||
                ''}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    ) : (<div className='text-center text-muted-foreground'>Use the editor toolbar to edit text styles.</div>)
  )
};

export default SettingsTab