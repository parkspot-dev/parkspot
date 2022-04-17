const getFlavour = (details, regexp) => {
  let isMobileDevice = regexp.test(details);

  if (isMobileDevice) {
    return "mweb";
  } else {
    return "dweb";
  }
};

export default {
  getFlavour,
};
