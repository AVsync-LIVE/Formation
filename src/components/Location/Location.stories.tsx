import React, { useEffect, useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Location } from '../../internal'
import { LocationData } from './Location'

export default {
  title: 'Input/Location',
  component: Location,
} as ComponentMeta<typeof Location>

const Template: ComponentStory<typeof Location> = (args) => {
  const [value, set_value] = useState((args as any).initialValue as LocationData)
  return (
    <Location 
      {...args} 
      value={value}
      onChange={newValue => set_value(newValue)}
    />
  )
}

export const Regular = Template.bind({})
Regular.args = {
  iconPrefix: 'fas',
  initialValue: {},
  label: 'Location'
}

export const Initial = Template.bind({})
Initial.args = {
  iconPrefix: 'fas',
  initialValue: {
    displayName: 'The III Studios'
  },
  label: 'Location',
  autoFocus: true
}