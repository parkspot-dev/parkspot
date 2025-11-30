import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TemplateBlogPost from "@/components/templates/TemplateBlogPost.vue";

const stubComponents = {
  HeaderBanner: { 
    template: `
      <div class='header-banner'>
        <h2>Test Blog Title</h2>
        <nav class='breadcrumb'>
          <span class='breadcrumb-item'>Home</span>
          <span class='breadcrumb-item'>Blogs</span>
        </nav>
      </div>
    ` 
  },
  AtomHeading: { template: "<h2 class='atom-heading'>Test Blog Title</h2>" },
  AtomParagraph: { template: "<p class='atom-paragraph'>Test Author</p>" },
  AtomImage: { template: "<img class='atom-image' src='/test.jpg' alt='Test Blog Title'/>" },
  BodyWrapper: { template: "<article class='body-wrapper article-wrapper'><slot /></article>" },
  "b-breadcrumb": { template: "<nav class='breadcrumb'><slot /></nav>" },
  "b-breadcrumb-item": { template: "<span class='breadcrumb-item'></span>" }
};

describe("TemplateBlogPost.vue - Complete Test Suite", () => {
  const mockBlog = {
    title: "Test Blog Title",
    author: "Test Author",
    author_img: "/test.jpg",
    time: "Jan 1, 2025",
    img: "/test-image.jpg"
  };

  const mountComponent = () => mount(TemplateBlogPost, {
    props: { blog: mockBlog },
    global: { stubs: stubComponents }
  });

  it("renders main components", () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.header-banner').exists()).toBe(true);
    expect(wrapper.find('.article-wrapper').exists()).toBe(true);
    expect(wrapper.find('.atom-image').exists()).toBe(true);
    expect(wrapper.find('.custom-author').exists()).toBe(true);
  });

  it("displays blog title and author", () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain("Test Blog Title");
    expect(wrapper.text()).toContain("Test Author");
  });

  it("passes image props correctly", () => {
    const wrapper = mountComponent();
    const img = wrapper.find('.atom-image');
    expect(img.attributes('alt')).toBe("Test Blog Title");
  });

  it("has proper breadcrumb structure", () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.breadcrumb').exists()).toBe(true);
    expect(wrapper.findAll('.breadcrumb-item').length).toBeGreaterThan(1);
  });

  it("matches snapshot for header banner", () => {
    const wrapper = mountComponent();
    const header = wrapper.find('.header-banner');
    expect(header.html()).toMatchSnapshot();
  });
});
