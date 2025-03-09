import m, { type ClassComponent } from 'mithril'
import { NavBar } from './nav/NavBar'

export class Layout implements ClassComponent<{}> {
    view(vnode: m.Vnode<{}>) {
        return m('.min-h-screen.bg-gradient-to-br.from-blue-950.to-indigo-700.p-6.flex.flex-col.items-center', [
            m(NavBar),
            m('h1.text-4xl.font-bold.text-white.mb-6.mt-4', 'Bewerbungstracker'),
            m(
                '.w-full.bg-white/20.backdrop-blur-lg.p-6.rounded-2xl.shadow-lg.border.border-white/30',
                vnode.children
            ),
            m('.toaster-wrapper', m(toaster))
        ])
    }
}
