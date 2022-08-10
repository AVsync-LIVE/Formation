import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ListEditor } from './ListEditor'

export default {
  title: 'Formation/ListEditor',
  component: ListEditor,
} as ComponentMeta<typeof ListEditor>


const Template: ComponentStory<typeof ListEditor> = args => 
  <div style={{display: 'flex'}}>
    <ListEditor {...args} />
    <div style={{width: '100%'}} />
  </div>

// calculateInitialValue: () => Lists,
// onChange: (lists: Lists) => void,
// onRemoveFunction?: (index: number) => void,
// calculateRecommendationLists?: () => Lists,
// calculateRecentLists?: () => Lists,
// isCreating: boolean

export const Regular = Template.bind({})
Regular.args = {
  calculateInitialValue: () =>[],
  onChange: (lists) => { console.log(lists)},
  onRemoveFunction: () => alert('remove'),
  calculateRecommendationLists: () => [],
  calculateRecentLists: () => [],
  isCreating: false
}