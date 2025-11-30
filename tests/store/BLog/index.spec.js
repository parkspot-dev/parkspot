import { describe, it, expect } from "vitest";
import blogStore from "@/store/blog/index.js";

const { state, getters, mutations } = blogStore;

describe("Blog Store - Complete Test Suite", () => {
  it("state has complete blogs array", () => {
    expect(Array.isArray(state.blogs)).toBe(true);
    expect(state.blogs.length).toBe(14);
    expect(state.blogs[0].title).toBe("Eliminating Traffic jams in India!");
  });
 
  it("getAllBlogs returns all blogs", () => {
    const blogs = getters.getAllBlogs(state);
    expect(blogs.length).toBe(14);
    expect(blogs).toEqual(state.blogs);
  });

  it("getBlogById returns correct blog", () => {
    const blog = getters.getBlogById(state)("eliminating-traffic-jams-in-india");
    expect(blog.title).toBe("Eliminating Traffic jams in India!");
  });

  it("selectedBlog mutation sets flag correctly", () => {
    const testState = JSON.parse(JSON.stringify(state));
    mutations.selectedBlog(testState, { id: "no-parking" });
    
    expect(testState.blogs[2].flag).toBe(true);
    expect(testState.blogs[0].flag).toBe(false);
  });

  it("matches snapshot for first blog item", () => {
    expect(state.blogs[0]).toMatchSnapshot();
  });
});
