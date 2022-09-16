const reader = new FileReader();
const fileByteArray = [];

/**
 * Converts the image file to byte array.
 * @param {file} image file.
 * @return {Array} byte array.
 */
function getConvertedImage(image) {
    return new Promise((resolve, reject) => {
        try {
            reader.readAsArrayBuffer(image);
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
