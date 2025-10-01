import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TemplateAbout from '@/components/templates/TemplateAbout.vue'
import { APP_LINK } from '@/constant/constant'

const stubs = {
  BodyWrapper: { template: '<div><slot /></div>' },
  AtomHeading: { template: '<h3><slot /></h3>' },
  AtomParagraph: { template: '<p><slot /></p>' },
  AtomImage: { template: '<img />' },
}

describe('TemplateAbout.vue (user-focused + style checks)', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TemplateAbout, { global: { stubs } })
  })

  it('renders the company overview text', () => {
    expect(wrapper.text()).toContain('Company Overview:')
    expect(wrapper.text()).toContain('Welcome to ParkSpot')
  })

  it('renders the services section', () => {
    expect(wrapper.text()).toContain('Our Services:')
    expect(wrapper.text()).toContain('monthly car parking services')
  })

  it('renders navigation links for parking spot', () => {
    const links = wrapper.findAll('a')
    const hrefs = links.map(a => a.attributes('href'))
    expect(hrefs).toContain('/get-parking-spot')
    expect(hrefs).toContain('/register-parking-spot')
  })

  it('has app store links for Android and iOS', () => {
    const links = wrapper.findAll('.app-links a')
    expect(links.length).toBe(2)
    expect(links[0].attributes('href')).toBe(APP_LINK.ANDROID)
    expect(links[1].attributes('href')).toBe(APP_LINK.IOS)
  })

  it('renders app store images with correct alt text', () => {
    const imgs = wrapper.findAll('.app-links img')
    expect(imgs.length).toBe(2)
    expect(imgs[0].attributes('alt')).toBe('google app link')
    expect(imgs[1].attributes('alt')).toBe('ios app link')
  })

  it('renders the main about image (existence check)', () => {
    const img = wrapper.find('.about-img')
    expect(img.exists()).toBe(true)
  })

  // CSS class checks
  it('applies correct classes for layout and links', () => {
    const container = wrapper.find('.about-container')
    expect(container.classes()).toContain('about-container')

    const desc = wrapper.find('.about-desc')
    expect(desc.classes()).toContain('about-desc')

    const links = wrapper.find('.about-links')
    expect(links.classes()).toContain('about-links')

    const appLinks = wrapper.find('.app-links')
    expect(appLinks.classes()).toContain('app-links')

    const parkLink = wrapper.find('.park-link')
    expect(parkLink.classes()).toContain('park-link')
  })

  // Snapshot test
  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})