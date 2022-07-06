import {
  required,
  email,
  regex,
  integer,
  image,
} from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("required", {
  ...required,
  message: "This {_field_} is required.",
});

extend("email", {
  ...email,
  message: "This Email is not valid.",
});

extend("regex", {
  ...regex,
  message: "{_field_} is not valid.",
});

extend("integer", {
  ...integer,
  message: "{_field_} should contain number.",
});

extend("image", {
  ...image,
  message: "This {_field_} must be an image.",
});
