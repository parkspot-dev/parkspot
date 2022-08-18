const reader = new FileReader();
const fileByteArray = [];

function getConvertedImage(data) {
    return new Promise((resolve, reject) => {
        try {
            reader.readAsArrayBuffer(data);
            reader.onloadend = (evt) => {
                if (evt.target.readyState === FileReader.DONE) {
                    const arrayBuffer = evt.target.result,
                        array = new Uint8Array(arrayBuffer);
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
