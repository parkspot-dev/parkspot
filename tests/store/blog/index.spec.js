import { describe, it, expect, beforeEach, vi } from 'vitest';
import blogStore from '@/store/blog/index.js';

const { getters, mutations } = blogStore;

describe('Blog Store - Complete Test Suite', () => {
    let state;

    beforeEach(() => {
        state = {
            blogs: blogStore.state.blogs.map(blog => ({ ...blog })),
        };
        vi.clearAllMocks();
    });

    it('state has complete blogs array', () => {
        expect(Array.isArray(state.blogs)).toBe(true);
        expect(state.blogs.length).toBe(14); // Current blog count as of Dec 2024
        expect(state.blogs[0].title).toBe('Eliminating Traffic jams in India!');
    });

    it('all blogs have required properties', () => {
        state.blogs.forEach((blog) => {
            expect(blog).toHaveProperty('id');
            expect(blog).toHaveProperty('title');
            expect(blog).toHaveProperty('author');
            expect(blog).toHaveProperty('dateTime');
            expect(blog).toHaveProperty('component');
        });
    });

    it('getAllBlogs returns all blogs', () => {
        const blogs = getters.getAllBlogs(state);
        expect(blogs.length).toBe(14);
        expect(blogs).toEqual(state.blogs);
    });

    it('getBlogById returns correct blog', () => {
        const blog = getters.getBlogById(state)(
            'eliminating-traffic-jams-in-india'
        );
        expect(blog.title).toBe('Eliminating Traffic jams in India!');
    });

    it('getBlogById returns undefined for non-existent id', () => {
        const blog = getters.getBlogById(state)('non-existent-id');
        expect(blog).toBeUndefined();
    });

    it('selectedBlog mutation sets flag correctly and resets others', () => {
        state.blogs[0].flag = true;
        mutations.selectedBlog(state, { id: 'no-parking' });
        expect(state.blogs[2].flag).toBe(true);
        expect(state.blogs[0].flag).toBe(false);
        const selectedCount = state.blogs.filter(b => b.flag).length;
        expect(selectedCount).toBe(1);
    });

    it('matches snapshot for first blog item', () => {
        expect(state.blogs[0]).toMatchSnapshot();
    });
});
