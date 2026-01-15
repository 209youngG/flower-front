import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import PaymentDialog from '../PaymentDialog.vue'

// Mock Quasar
installQuasarPlugin()

describe('Component: PaymentDialog', () => {
  it('renders correctly when open', () => {
    const wrapper = mount(PaymentDialog, {
      props: {
        modelValue: true,
        orderId: 123
      },
      global: {
        stubs: {
            'q-dialog': { template: '<div><slot /></div>' },
            'q-card': { template: '<div><slot /></div>' },
            'q-card-section': { template: '<div><slot /></div>' },
            'q-card-actions': { template: '<div><slot /></div>' },
            'q-btn': { template: '<button><slot /></button>' },
            'q-option-group': { template: '<div></div>' }
        }
      }
    })

    expect(wrapper.text()).toContain('결제')
    expect(wrapper.text()).toContain('주문번호: 123')
  })
})
