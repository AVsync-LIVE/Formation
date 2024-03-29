import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'


import { Navigation, ParseHTML, StyleHTML, Page } from '../../internal'

export default {
  title: 'Navigation/Navigation',
  component: Navigation,
} as ComponentMeta<typeof Navigation>

const Template: ComponentStory<typeof Navigation> = (args) => {
  const [open, set_open] = useState(true)

  return (<Navigation {...args} open={open} onSetOpen={isOpen => set_open(isOpen)}>
    <Page>
      
    </Page>
  </Navigation>)

}

export const Regular = Template.bind({})
Regular.args = {
  navLogoSrc: 'logo-white.svg',
  navs: [
    {
      type: 'nav',
      name: 'Home',
      icon: 'info-circle',
      href: '/',
      active: true
    },
    {
      type: 'nav',
      name: 'Scenes',
      icon: 'info-circle',
      href: '/scenes',
      toolTipTitle: 'Browse scenes to build your playlist'
    },
    {
      type: 'clickNav',
      name: 'Deck',
      toolTipTitle: 'Perform live music visuals with the scenes in your playlist',
      icon: 'info-circle',
      href: '/app',
      active: false,
      onClick: ()=> {
      
      }
    },
    {
      type: 'nav',
      name: 'Mosh',
      icon: 'info-circle',
      href: '/mosh',
      toolTipTitle: 'Datamosh video files'
    },
    {
      type: 'title',
      title: 'Learn'
    },
    {
      type: 'nav',
      name: 'Tutorials',
      icon: 'info-circle',
      href: '/tutorials',
      toolTipTitle: 'Learn how to create, perform, and share live music visuals'
    },
    {
      type: 'nav',
      name: 'FAQ',
      icon: 'info-circle',
      href: '/faq',
      hideWhenCollapsed: true,
      toolTipTitle: 'Get answers about AVsync.LIVE'
    },
    {
      type: 'nav',
      name: 'Contact Us',
      icon: 'info-circle',
      hideWhenCollapsed: true,
      toolTipTitle: 'Contact us on Facebook Messenger, Instagram, or Discord',
      onClick: () => {
      }
    }
  ] 
}
Regular.parameters = {
  layout: 'fullscreen',
  
}