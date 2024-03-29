import React, { useState } from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ColorPicker } from '../../internal'

export default {
  title: 'Input/ColorPicker',
  component: ColorPicker,
} as ComponentMeta<typeof ColorPicker>

const Template: ComponentStory<typeof ColorPicker> = args => {
  const [color, set_color] = useState('#9F0500')
  return <ColorPicker 
    {...args} 
    onChange={color => set_color(color)}
    value={color}
  />
}
  
    
export const Default = Template.bind({})
Default.args = {
  value: '#9F0500'
}

export const HidePresets = Template.bind({})
HidePresets.args = {
  value: '#9F0500',
  hidePresets: true
}
