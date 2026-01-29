import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import StoreRegisterPage from './StoreRegisterPage.vue';

// Mock Quasar plugins
const mockRouterPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: vi.fn(),
    loading: {
      show: vi.fn(),
      hide: vi.fn(),
    },
  }),
}));

describe('StoreRegisterPage', () => {
  let originalCreateElement: any;

  beforeEach(() => {
    // Mock script element creation to prevent external resource loading
    originalCreateElement = document.createElement;
    const mockScript = {
      src: '',
      async: false,
    } as any;
    
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'script') {
        return mockScript;
      }
      return originalCreateElement.call(document, tagName);
    });
    
    // Mock appendChild to avoid errors when appending the mock script
    vi.spyOn(document.head, 'appendChild').mockImplementation(() => {
      return {} as any;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(StoreRegisterPage, {
      global: {
        stubs: {
          'q-page': { template: '<div><slot /></div>' },
          'q-card': { template: '<div><slot /></div>' },
          'q-card-section': { template: '<div><slot /></div>' },
          'q-form': { template: '<form><slot /></form>' },
          'q-input': true,
          'q-btn': true,
          'q-space': true,
          'q-icon': true,
          'q-popup-proxy': true,
          'q-time': true,
          'q-checkbox': true,
        },
        directives: {
          'close-popup': {},
        }
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('div.text-h6').text()).toBe('매장 등록');
  });

  it('has all required form fields', () => {
    const wrapper = mount(StoreRegisterPage, {
      global: {
        stubs: {
            'q-page': { template: '<div><slot /></div>' },
            'q-card': { template: '<div><slot /></div>' },
            'q-card-section': { template: '<div><slot /></div>' },
            'q-form': { template: '<form><slot /></form>' },
            'q-input': { template: '<input class="q-input-stub" />' },
            'q-btn': true,
            'q-space': true,
            'q-icon': true,
            'q-popup-proxy': true,
            'q-time': true,
            'q-checkbox': true,
        },
        directives: {
          'close-popup': {},
        }
      },
    });

    const inputs = wrapper.findAll('.q-input-stub');
    expect(inputs.length).toBeGreaterThanOrEqual(8); 
  });
});
