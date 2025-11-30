import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TemplateBlogHome from "@/components/templates/TemplateBlogHome.vue";

const stubComponents = {
  HeaderBanner: { template: "<div class='header-banner'><h1>Parking Blogs</h1></div>" },
  BodyWrapper: { template: "<section class='body-wrapper'><slot /></section>" },
  MoleculeBlogCard: {
    props: ["blog"],
    template: `
      <div class='molecule-blog-card'>
        <h3>{{ blog.title }}</h3>
      </div>
    `
  },
  "b-breadcrumb": { template: "<nav class='b-breadcrumb'><slot /></nav>" },
  "b-breadcrumb-item": { template: "<span class='breadcrumb-item'>Home / Blogs</span>" }
};

describe("TemplateBlogHome.vue - Complete Test Suite", () => {
  const mockBlogs = [
    { id: 1, title: "Blog 1" },
    { id: 2, title: "Blog 2" }
  ];

  const mountComponent = () => mount(TemplateBlogHome, {
    props: { blogs: mockBlogs },
    global: { stubs: stubComponents }
  });


  it("renders main components", () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.header-banner').exists()).toBe(true);
    expect(wrapper.find('.body-wrapper').exists()).toBe(true);
    expect(wrapper.findAll('.molecule-blog-card').length).toBe(2);
  });

s  
  it("renders blog titles correctly", () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll('.molecule-blog-card h3')[0].text()).toBe("Blog 1");
  });

  it("emits onBlogClick event", async () => {
    const wrapper = mountComponent();
    await wrapper.vm.onBlogClick(mockBlogs[0]);
    expect(wrapper.emitted('onBlogClick')).toBeTruthy();
  });

  it("has breadcrumb navigation", () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.b-breadcrumb').exists()).toBe(true);  
    expect(wrapper.findAll('.breadcrumb-item').length).toBeGreaterThan(0);
  });

  it("matches snapshot for single blog card", () => {
    const wrapper = mountComponent();
    const firstCard = wrapper.findAll('.molecule-blog-card')[0];
    expect(firstCard.html()).toMatchSnapshot();
  });
});
