export type LabelColor = 
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

export const labelColors : LabelColor[] = [
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
  labelColor: LabelColor
}
/**
 * @function getLabelColor
 * 
 * This function take `LabelColor` type as a parameter and returns the corresponding color property from a predefined list.
 * This method is used to dynamically fetch the css variable values for label colors.
 * LabelColor is a type with possible options: 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'cyan', 'teal', 'gray'.
 * 
 * @param {LabelColor} labelColor - The label color parameter passed to get corresponding CSS variable value.
 * 
 * @returns {string} The value of the corresponding CSS variable for the label color.
 * 
 * @example
 * const labelColor = 'blue'
 * const blueColor = getLabelColor(labelColor)  // Gives 'var(--F_Label_Color_Blue)'
 */
export const getLabelColor = (labelColor: LabelColor | string): string => {
  switch(labelColor) {
    case 'red':
      return 'var(--F_Label_Color_Red)'
      case 'orange':
        return 'var(--F_Label_Color_Orange)'
    case 'yellow':
      return 'var(--F_Label_Color_Yellow)'
    case 'green':
      return 'var(--F_Label_Color_Green)'
    case 'blue':
      return 'var(--F_Label_Color_Blue)'
    case 'indigo':
      return 'var(--F_Label_Color_Indigo)'
    case 'purple':
      return 'var(--F_Label_Color_Purple)'
    case 'pink':
      return 'var(--F_Label_Color_Pink)'
    case 'cyan':
      return 'var(--F_Label_Color_Cyan)'
    case 'teal':
      return 'var(--F_Label_Color_Teal)'
    case 'gray':
      return 'var(--F_Label_Color_Gray)'
    default:
      return 'none'
  }
}
