import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { LoadingSpinner } from '../../internal'

export default {
  title: 'General/LoadingSpinner',
  component: LoadingSpinner,
} as ComponentMeta<typeof LoadingSpinner>

const Template: ComponentStory<typeof LoadingSpinner> = (args) => <LoadingSpinner {...args} />

export const Regular = Template.bind({})
Regular.args = {
  
}

export const Small = Template.bind({})
Small.args = {
  small: true
}

export const Chat = Template.bind({})
Chat.args = {
  small: true,
  chat: true
}