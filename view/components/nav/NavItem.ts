import m, { type ClassComponent } from 'mithril'

interface Attrs {
  route: string
  label: string   
}

export class NavItem implements ClassComponent<Attrs> {
  view({ attrs }: m.Vnode<Attrs>) {
    const isActive = m.route.get() === '/' + attrs.route
    return m('.nav-item', 
      isActive 
        ? m('span.active', attrs.label)
        : m(m.route.Link, { href: attrs.route }, attrs.label)
    )
  }
}
