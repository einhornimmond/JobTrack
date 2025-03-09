import m, { type ClassComponent } from 'mithril'

interface Attrs {
    label: string;
}

export class HeaderField implements ClassComponent<Attrs> {
    view({ attrs }: m.Vnode<Attrs>) {
        return m('th.p-2.text-left', attrs.label)
    }
};
