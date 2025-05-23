import m from 'mithril'
import { SelectableType } from '../model/SelectableType'

export interface Option {
  id: number
  name: string
}

export interface Attrs<T extends Option> {
  selectableType: SelectableType<T>
  value: number
  onchange: (value: number) => void
  label?: string
  placeholder?: string
}

export class Select<T extends Option> implements m.ClassComponent<Attrs<T>> {
  private showAddOption: boolean = false
  private newOptionName: string = ''
  private isLoading: boolean = false
  
  private handleSelectChange(e: Event, attrs: Attrs<T>): void {
    const target = e.target as HTMLSelectElement
    const value = parseInt(target.value, 10)
    
    if (value === -1) {
      this.showAddOption = true
    } else {
      attrs.onchange(value)
    }
  }

  private handleInputChange(e: InputEvent): void {
    this.newOptionName = (e.target as HTMLInputElement).value
  }

  private handleCancelAdd(e: Event): void { 
    e.preventDefault()
    this.showAddOption = false
    this.newOptionName = ''
  }

  private async handleAddOption(e: Event, attrs: Attrs<T>): Promise<void> {
    e.preventDefault()
    if (!this.newOptionName.trim()) return
    
    this.isLoading = true
    try {
      const newOption = await attrs.selectableType.add(this.newOptionName.trim())
      attrs.onchange(newOption.id)
      this.showAddOption = false
      this.newOptionName = ''
      
      toaster.success('Option erfolgreich hinzugefügt')
            
      m.redraw()
    } catch (error) {
      if (typeof toaster !== 'undefined') {
        toaster.error(error instanceof Error ? error.message : 'Unbekannter Fehler')
      }
    } finally {
      this.isLoading = false
    }
  }

  view({ attrs }: m.CVnode<Attrs<T>>) {
    const options = attrs.selectableType.getOptions()
    
    return m('.select-container.mb-4', [
      attrs.label && m('label.block.text-white.mb-2', attrs.label),
      m('.flex.flex-col', [
        m('select.text-white.border.border-white/30.rounded-lg.p-2.mb-2', {
          value: attrs.value,
          onchange: (e: Event) => this.handleSelectChange(e, attrs)
        }, [
          m('option', { value: 0, disabled: true, selected: !attrs.value }, 
            attrs.placeholder || 'Bitte wählen...'),
          options.map(option => 
            m('option.text-stone-800', { value: option.id, selected: attrs.value === option.id }, option.name)
          ),
          m('option.text-stone-600', { value: -1 }, '+ Neue Option hinzufügen')
        ]),
        
        this.showAddOption && m('.add-option-container.p-3.rounded-lg.mb-2', [
          m('.flex.items-center.gap-2', [
            m('input.text-white.border.border-white/30.rounded-lg.p-2.flex-grow', {
              type: 'text',
              placeholder: 'Neue Option eingeben',
              value: this.newOptionName,
              oninput: (e: InputEvent) => this.handleInputChange(e)
            }),
            m('button.bg-sky-800.hover:bg-sky-900.text-white.rounded-lg.p-2', {
              disabled: this.isLoading || !this.newOptionName.trim(),
              onclick: (e: Event) => this.handleAddOption(e, attrs)
            }, this.isLoading ? 'Wird hinzugefügt...' : 'Hinzufügen'),
            m('button.bg-gray-500.hover:bg-gray-600.text-white.rounded-lg.p-2', {
              onclick: (e: Event) => this.handleCancelAdd(e)
            }, 'Abbrechen')
          ])
        ])
      ])
    ])
  }
}
