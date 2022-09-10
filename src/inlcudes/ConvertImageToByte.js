const reader = new FileReader();
const fileByteArray = [];

/**
 * convert the image file to Byte Array
 * @param {File} img image file.
 * @return {Array} converted Byte Array of image file.
 */
function getConvertedImage(img) {
  return new Promise((resolve, reject) => {
    try {
      reader.readAsArrayBuffer(img);
      reader.onloadend = (evt) => {
        if (evt.target.readyState === FileReader.DONE) {
          const arrayBuffer = evt.target.result;
          const array = new Uint8Array(arrayBuffer);
          for (const a of array) {
            fileByteArray.push(a);
          }
          resolve(fileByteArray);
        }
      };
    } catch (e) {
      reject(e);
    }
  });
}

export { getConvertedImage };
