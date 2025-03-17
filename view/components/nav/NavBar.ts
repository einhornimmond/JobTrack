import m from 'mithril'
import { NavItem } from './NavItem'

export const NavBar: m.Component = {
    view: () => {
        return m("nav.w-full.bg-blue-800.py-4.shadow-lg.flex.justify-center", 
            m('.max-w-4xl.w-full.flex.justify-around.text-white.text-lg', [
                m(NavItem, { route: '/applications', label: 'Alle Bewerbungen' }),
                m(NavItem, { route: '/lastApplications', label: 'Letzte Bewerbungen' })
            ])
        )
    }
}
