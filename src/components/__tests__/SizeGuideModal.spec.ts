import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SizeGuideModal from '../SizeGuideModal.vue'

describe('Component: SizeGuideModal', () => {
  const factory = (props = {}) => {
    return mount(SizeGuideModal, {
      props: {
        modelValue: true,
        ...props
      },
      global: {
        stubs: {
          'q-dialog': { template: '<div><slot /></div>' },
          'q-card': { template: '<div><slot /></div>' },
          'q-card-section': { template: '<div><slot /></div>' },
          'q-card-actions': { template: '<div><slot /></div>' },
          'q-btn': { 
            props: ['label'],
            template: '<button @click="$emit(\'click\')">{{ label }}<slot /></button>' 
          },
          'q-tabs': { template: '<div><slot /></div>' },
          'q-tab': { template: '<div @click="$emit(\'click\')"><slot /></div>' },
          'q-tab-panels': { template: '<div><slot /></div>' },
          'q-tab-panel': { template: '<div><slot /></div>' },
          'q-separator': { template: '<div />' },
          'q-list': { template: '<div><slot /></div>' },
          'q-item': { template: '<div @click="$emit(\'click\')"><slot /></div>' },
          'q-item-section': { template: '<div><slot /></div>' },
          'q-item-label': { template: '<div><slot /></div>' },
          'q-avatar': { template: '<div><slot /></div>' },
          'q-badge': { template: '<div><slot /></div>' }
        }
      }
    })
  }

  it('renders correctly when open', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('Choose Your Size')
    expect(wrapper.text()).toContain('FLOWER GUIDE')
  })

  it('shows size recommendations when a size is selected', async () => {
    const wrapper = factory()
    
    // Initially "Select a size to see recommendations" should be visible
    expect(wrapper.text()).toContain('Select a size to see recommendations')

    // Find all size columns and click the first one (Small)
    const sizeColumns = wrapper.findAll('.size-column')
    await sizeColumns[0].trigger('click')

    expect(wrapper.text()).toContain('Small recommended for')
    expect(wrapper.text()).toContain('Perfect for a casual gift or self-care.')
  })

  it('updates selection and recommendation text for different sizes', async () => {
    const wrapper = factory()
    
    const sizeColumns = wrapper.findAll('.size-column')
    
    // Click XL (index 3)
    await sizeColumns[3].trigger('click')
    expect(wrapper.text()).toContain('Extra Large recommended for')
    expect(wrapper.text()).toContain('Grand gestures for weddings or big events.')
  })

  it('emits "select" event with correct size code when confirm button is clicked', async () => {
    const wrapper = factory()
    
    // Select Medium
    const sizeColumns = wrapper.findAll('.size-column')
    await sizeColumns[1].trigger('click')

    // Find confirm button - it should contain "Select M"
    const buttons = wrapper.findAll('button')
    const confirmBtn = buttons.find(b => b.text().includes('Select M'))
    expect(confirmBtn).toBeDefined()

    await confirmBtn?.trigger('click')
    
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual(['M'])
  })
})
