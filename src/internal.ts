// utils
export { getSuperscriptOrdinal } from './utils/getSuperscriptOrdinal'
export { getOrdinal } from './utils/getOrdinal'
export { isTouchCapable } from './utils/isTouchCapable'  
export { getTimezone } from './utils/getTimezone'
export { reorderItems } from './utils/reorderItems'
export { LabelColor, labelColors, LabelType, getLabelColor } from './utils/labels'
export { getColorFromGuid } from './utils/getColorFromGuid'
export { getInitials } from './utils/getInitials'
export { capitalizeFirstLetter } from './utils/capitalizeFirstLetter'
export { copyToClipboard } from './utils/copyToClipboard'  
export { downloadFile } from './utils/downloadFile'
export { shareText } from './utils/shareText'
export { shareTextViaEmail } from './utils/shareTextViaEmail'
export { getTimeAgo } from './utils/getTimeAgo'
export { blobToBase64 } from './utils/blobToBase64'
export { timestamp } from './utils/timestamp'
export { getZoomScale } from './utils/getZoomScale'
export { stringInArray } from './utils/stringInArray'
export { getCookie } from './utils/getCookie'
export { resourceUrlToDataUrl } from './utils/resourceUrlToDataUrl'
export { resizeDataURL } from './utils/resizeDataURL'
export { calculateFileHash } from './utils/calculateFileHash'
export { markdownToHTML } from './utils/markdownToHTML'
export { HTMLtoMarkdown } from './utils/HTMLtoMarkdown' 
export { titleToSlug } from './utils/titleToSlug'
export { slugToTitle } from './utils/slugToTitle'
export { pickIndexFromArray, hashString } from './utils/pickIndexFromArray'
export { generateUUID } from './utils/generateUUID'
export { scrollToElementById } from './utils/scrollToElementById'
export { getAlphabetLetter } from './utils/getAlphabetLetter'

// hooks
export { useBreakpoint } from './hooks/useBreakpoint'
export { useOnClickOutside } from './hooks/useOnClickOutside'
export { useScrollTo } from './hooks/useScrollTo'
export { useIsScrolledToBottom } from './hooks/useIsScrolledToBottom'
export { useScrollVisible } from './hooks/useScrollVisible'
export { usePrevious } from './hooks/usePrevious'

// types
import { ItemProps } from './components/ListEditor/Item'
export {
  ItemProps
}

// Atoms (0)
export { AspectRatio } from './components/AspectRatio/AspectRatio'
export { Auth } from './components/Auth/Auth'
export { Badge } from './components/Badge/Badge'
export { Box } from './components/Box/Box'
export { Break } from './components/Break/Break'
export { ColorPicker } from './components/ColorPicker/ColorPicker'
export { Empty } from './components/Empty/Empty'
export { Gap } from './components/Gap/Gap'
export { Grid } from './components/Grid/Grid'
export { Icon, Props as IconProps } from './components/Icon/Icon'
export { Label } from './components/Label/Label'
export { LineBreak } from './components/LineBreak/LineBreak'
export { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner'
export { NavHeader } from './components/NavHeader/NavHeader'
export { NavLogo } from './components/NavLogo/NavLogo'
export { NavMenuBars } from './components/NavMenuBars/NavMenuBars'
export { NumberRange } from './components/Sliders/NumberRange'
export { Page } from './components/Page/Page'
export { ParseHTML } from './components/ParseHTML/ParseHTML'
export { Progress } from './components/Progress/Progress'
export { Reorder } from './components/Reorder/Reorder'
export { Ripple } from './components/Ripple/Ripple'
export { Spacer } from './components/Spacer/Spacer'
export { StyleHTML } from './components/StyleHTML/StyleHTML'
export { Docking } from './components/Docking/Docking'
export { Link } from './components/Link/Link'
export { Avatar } from './components/Avatar/Avatar'
export { Placeholders } from './components/Placeholders/Placeholders'
export { Modal } from './components/Modal/Modal'
export { ImagePicker } from './components/ImagePicker/ImagePicker'
export { RichTextEditor } from './components/RichTextEditor/RichTextEditor'
export { Steps } from './components/Steps/Steps'
export { Checkboxes } from './components/Checkboxes/Checkboxes'

// Molecules (1)
export { ArticlePreview } from './components/ArticlePreview/ArticlePreview'
export { Article } from './components/Article/Article'
export { SearchSortFilter } from './components/SearchSortFilter/SearchSortFilter'
export { Radio } from './components/Radio/Radio'
export { Button, ButtonProps } from './components/Button/Button'
export { Notification } from './components/Notification/Notification'
export { TextInput, TextInputProps } from './components/TextInput/TextInput'
export { Dropdown } from './components/Dropdown/Dropdown'
export { Sidebar, Navs } from './components/Sidebar/Sidebar'
export { Select } from './components/Select/Select'
export { Switch } from './components/Switch/Switch'
export { LabelColorPicker } from './components/LabelColorPicker/LabelColorPicker'
export { Item } from './components/ListEditor/Item'
export { LiveTimeIndicator } from './components/Timeline/LiveTimeIndicator'
export { AutocompleteDropdown } from './components/AutocompleteDropdown/AutocompleteDropdown'
export { NumberInput } from './components/NumberInput/NumberInput'

// Tissue (2)
export { Navigation } from './components/Navigation/Navigation'
export { Location } from './components/Location/Location'
export { TimePicker } from './components/TimePicker/TimePicker'
export { DatePicker } from './components/DatePicker/DatePicker'
export { Tags } from './components/Tags/Tags'
export { Tabs } from './components/Tabs/Tabs'
export { TimeReference } from './components/Timeline/TimeReference'
export { TimelineSurface } from './components/Timeline/TimelineSurface'
export { TimeZone } from './components/TimeZone/TimeZone'
export { LabelEditor } from './components/LabelEditor/LabelEditor'
export { List } from './components/ListEditor/List'
export { LabelManager } from './components/LabelManager/LabelManager'
export { Timeline } from './components/Timeline/Timeline'
export { ExpandableList } from './components/ListEditor/ExpandableList'
export { DateAndTimePicker } from './components/DateAndTimePicker/DateAndTimePicker'
export { NumberSlider } from './components/Sliders/NumberSlider'

import React from 'react'

import { Link } from './components/Link/Link'
let linkComponent = Link as any
export const getLinkComponent = () => linkComponent
export const setLinkComponent = (newLinkComponent : React.ReactNode) => {
  linkComponent = newLinkComponent
}

import { LinkContext, Linker } from './components/Linker/Linker'

export {
  LinkContext,
  Linker
}
