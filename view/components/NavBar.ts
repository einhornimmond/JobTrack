import m from 'mithril'

export const NavBar: m.Component = {
    view: () => {
        return m("div.navbar.navbar-default.navbar-fixed-top", [
            m("div.container-fluid", [
                m("div.navbar-header", [
                    m("button.navbar-toggle", {
                        type: "button",
                        "data-toggle": "collapse",
                        "data-target": "#admin-navbar-collapse-1"
                    }, [
                        m("span.sr-only", "Toggle navigation"),
                        m("span.icon-bar"),
                        m("span.icon-bar"),
                        m("span.icon-bar")
                    ]),
                    m("a.navbar-brand", { href: "/" }, "DR")
                ]),
                m("div.collapse.navbar-collapse.show", { id: "admin-navbar-collapse-1" }, [
                    m("ul.nav.navbar-nav", [
                        m("li", {
                            class: m.route.get().startsWith('/application/') ? 'active' : ''
                        }, [
                            m("a", { href: '/applications' }, "Bewerbungen"),
                            m("ul.nav.subnav", [
                                m("li", m("a", { href: '/lastApplications' }, "Bewerbungen der letzten 6 Monate"))
                            ])
                        ]),
                        /*m("li", {
                            class: m.route.get().startsWith('/type_of_contact/') ? 'active' : ''
                        }, m("a", { href: '/type_of_contact' }, "Kontaktarten")),
                        m("li", {
                            class: m.route.get().startsWith('/type_of_status/') ? 'active' : ''
                        }, m("a", { href: '/type_of_status' }, "Statusarten"))*/
                    ])
                ])
            ])
        ])
    }
}
