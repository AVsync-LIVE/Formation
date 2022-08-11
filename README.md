# Formation

[Storybook](https://avsync-live.github.io/formation) |
[GitHub Repository](https://github.com/AVsync-LIVE/formation) |
[NPM Package](https://www.npmjs.com/package/@avsync.live/formation)

Formation is a component library based on React, Styled Components and CSS variables.







## Installation

```shell
yarn add @avsync.live/formation
```

## Usage

```jsx
  import React from 'react'
  import { Button } from '@avsync.live/formation'

  const MyComponent = () => {
    return <Button text='Click me' />
  }
```

## Icons

Formation uses [FontAwesome v6](https://fontawesome.com/v6/search?m=free) and supports both pro and free icons.

```jsx
// import FontAwesome in your project
import '@fortawesome/fontawesome-svg-core/styles.css'
import { library } from '@fortawesome/fontawesome-svg-core'

import { faHeart } from '@fortawesome/free-solid-svg-icons'

library.add(faHeart)

// in your component
import React from 'react'
import { Button } from '@avsync.live/formation'

const MyComponent = () => {
  return <Button 
    text='Click me' 
    icon='heart' // name of the icon without the "fa" and in kebab-case
    iconPrefix='fas' // fas, far, fal, etc
   />;
}
```

## Theming

Theming is based on CSS variables.

## Why Formation?
 - Responsive from the smallest of phones to the largest of multi-window 4K monitors
 - Touch-first
 - No reliance on right clicks
 - No reliance on hover states
 - Allow for hold-to-drag and swiping, but also provide tap/click-only alternatives
 - Minimal use of animations
 - Easily modify the styling using css variables
 - Prefer a small inline dropdown over a context-changing modal popup.

## Implementation
 - [React](https://reactjs.org/docs/getting-started.html)
 - [Styled Components](https://styled-components.com/docs)
 - [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
 - Surface-based background-color system
 - Use of Storybook to develop, manage, and visualize components outside of an application
 - [TODO] Code sandbox examples for all components
 - [TODO] Design system guide similar to [Material Design documentation](https://material.io/design/environment/elevation.html)

## Philosophy

The name [Formation](https://www.etymonline.com/word/formation) expresses both the *form* embodied by the user interface, and the process by which user interaction *forms* the desired outcome of the application. The layout of the document is also composed of a *formation* of components.

Formation adheres to the Unimpeded Design System philosophy, where users do not have to wait for animations to complete, or for the app to finishing changing modes in order to proceed with their task. The user is only limited physically by their reaction time.