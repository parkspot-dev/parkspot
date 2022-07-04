import { required, email, regex } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("required", {
  ...required,
  message: "This {_field_} is required",
});

extend("email", {
  ...email,
  message: "This Email is not valid",
});

extend("regex", {
  ...regex,
  message: "{_field_} is not valid",
});
