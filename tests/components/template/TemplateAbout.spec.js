import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TemplateAbout from '@/components/templates/TemplateAbout.vue'
import { APP_LINK } from '@/constant/constant'

// Stub AtomHeading honestly: pass through to the heading level the
// caller requests, otherwise the heading-hygiene assertions below
// would all collapse onto `<h3>` and we'd lose the regression.
const stubs = {
  BodyWrapper: { template: '<div><slot /></div>' },
  AtomHeading: {
    props: ['level'],
    template: '<component :is="level || \'h3\'"><slot /></component>',
  },
  AtomParagraph: { template: '<p><slot /></p>' },
  AtomImage: { template: '<img />' },
}

describe('TemplateAbout.vue (user-focused + style checks)', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TemplateAbout, { global: { stubs } })
  })

  it('renders the company overview text', () => {
    expect(wrapper.text()).toContain('Company Overview')
    expect(wrapper.text()).toContain('Welcome to ParkSpot')
  })

  it('renders the services section', () => {
    expect(wrapper.text()).toContain('Our Services')
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

  // Phase 2.5 heading-hygiene regression. Before the patch the about
  // page shipped a hierarchy of: <h3>Company Overview</h3>,
  // <h3>Our Services</h3> with no <h1> or <h2> above them. SEO
  // audit tools and screen readers both penalise this. The patch
  // adds a single headline (PAGE_H1.ABOUT) and promotes the section
  // sub-headings to <h2>.
  //
  // Phase 2.5b follow-up (patch 0016): the headline level is now a
  // prop. Default is <h2> so that homepage / other section embeds
  // don't introduce a second <h1>; PageAbout opts the /about/ route
  // back into <h1> via `heading-level="h1"`.
  describe('Phase 2.5 — heading hygiene', () => {
    it('renders headline as <h2> by default (section-embed safe)', () => {
      // Default mount = no headingLevel prop. The /about/ route opts
      // in to h1 explicitly; everywhere else this template is
      // embedded as a section and must not leak a second h1.
      expect(wrapper.findAll('h1').length).toBe(0)
      const headline = wrapper.find('.about-headline')
      expect(headline.exists()).toBe(true)
      expect(headline.element.tagName.toLowerCase()).toBe('h2')
    })

    it('renders headline as <h1> when headingLevel="h1" prop is passed', () => {
      const w = mount(TemplateAbout, {
        global: { stubs },
        props: { headingLevel: 'h1' },
      })
      expect(w.findAll('h1').length).toBe(1)
      const headline = w.find('.about-headline')
      expect(headline.element.tagName.toLowerCase()).toBe('h1')
      w.unmount()
    })

    it('uses the PAGE_H1.ABOUT constant as the headline text (any level)', async () => {
      const { PAGE_H1 } = await import('@/constant/constant')
      expect(wrapper.find('.about-headline').text()).toBe(PAGE_H1.ABOUT)
    })

    it('promotes section sub-headings from <h3> to <h2>', () => {
      const h2s = wrapper.findAll('h2').map((h) => h.text())
      expect(h2s).toEqual(
        expect.arrayContaining(['Company Overview', 'Our Services']),
      )
    })

    it('emits no orphan <h3> (every h3 must have a parent h1/h2)', () => {
      // Practical check: there should be no h3s in the page at all
      // now that we've promoted the section headings. If a future
      // edit reintroduces one, this test fires.
      expect(wrapper.findAll('h3').length).toBe(0)
    })

    it('rejects invalid headingLevel values via prop validator', () => {
      // The validator only warns in dev — assert the contract by
      // reading the component options directly.
      const validator =
        TemplateAbout.props?.headingLevel?.validator ||
        TemplateAbout.default?.props?.headingLevel?.validator
      expect(validator).toBeTypeOf('function')
      expect(validator('h1')).toBe(true)
      expect(validator('h6')).toBe(true)
      expect(validator('h7')).toBe(false)
      expect(validator('div')).toBe(false)
    })
  })

  // Snapshot test
  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})