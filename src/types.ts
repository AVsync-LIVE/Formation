export type ColorType = 
  'red' | 
  'orange' | 
  'yellow' |
  'green' |
  'blue' | 
  'indigo' | 
  'purple' |
  'pink' |
  'cyan' | 
  'teal' | 
  'gray' |
  'none'

export const Colors : ColorType[] = [
  'red', 
  'orange', 
  'yellow',
  'green',
  'blue', 
  'indigo', 
  'purple',
  'pink', 
  'cyan', 
  'teal', 
  'gray',
  'none'
]

export type LabelType = {
  name: string,
  description: string,
  color: ColorType
}