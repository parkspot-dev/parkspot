<template>
  <div class="m_blog_box">
    <div class="card">
      <div class="card-image">
        <figure class="image is-4by3">
          <atom-img v-if="blogDetails.postImage" :src="blogDetails.postImage" />
          <atom-img v-else :src="src" />
          <!-- <img
            src="https://bulma.io/images/placeholders/1280x960.png"
            alt="Placeholder image"
          /> -->
        </figure>
      </div>
      <div class="card-content">
        <div class="content">
          <atom-b-subtitle class="is-size-4" :text="blogDetails.postTitle" />
          <atom-text class="is-size-6" :text="blogDetails.postSummary" />
          <atom-link class="is-size-6" :text="read" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import atomImg from "../atoms/atom-img/atom-img.vue";
import AtomLink from "../atoms/atom-link/atom-link.vue";
import AtomBSubtitle from "../atoms/atom-text/atom-b-subtitle.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { atomImg, AtomBSubtitle, AtomText, AtomLink },
  name: "m-blog-box-details",
  props: ["blogDetails"],
  data() {
    return {
      src: "https://bulma.io/images/placeholders/1280x960.png",
      subtitle: "This is subtitle for subheading",
      text: "This is paragraph written in blog please click the blog to see the th blog content in details.",
      read: "Read more..",
    };
  },
};
</script>