import m from 'mithril'
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils'
import { icons as mdiIcons } from '@iconify-json/mdi'
// import { icons as lucideIcons } from '@iconify-json/lucide'

interface IconAttrs {
  icon: string
  width?: string;
  height?: string
  iconSet: 'mdi' | 'lucide'
}

export const Icon: m.ClassComponent<IconAttrs> = {
  view: ({ attrs }) => {
    const iconData = attrs.iconSet === 'mdi' ? getIconData(mdiIcons, attrs.icon) : getIconData(lucideIcons, attrs.icon)
    if (!iconData) {
      throw new Error(`Icon "${attrs.icon}" is missing`)
    }
    const renderData = iconToSVG(iconData)
    const svg = replaceIDs(renderData.body)
    return m.trust(iconToHTML(svg, renderData.attributes))
  }
}