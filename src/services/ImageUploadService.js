import { mayaClient } from "./api";

// Gets SAS URL to upload images
async function getSasUrl() {
    return mayaClient.get('sas-url');
}

// Uploads images to the SAS URL using a unique filename format (`namePrefix:epochTime.extension`).
// The `namePrefix` parameter should be the `SpotRequestId` to ensure uniqueness across different requests.
async function uploadImages(Images, namePrefix) {
    if (!namePrefix) {
        throw new Error("Error: namePrefix is required and must be a non-empty string.");
    }
    const sasUrl = await getSasUrl();
    if (sasUrl.ErrorCode) {
        return {
            success: false,
            DisplayMsg: sasUrl.DisplayMsg,
        };
    }
    // Mapping MIME types to file extensions
    const extensionMap = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/heic': '.heic'
    };
    const [baseUrl, queryParams] = sasUrl.split('?');
    const uploadPromises = Images.map(async (img, index) => {
    const epochTime = Date.now() + index;

    const fileObj = img.file || img; 
    const extension = extensionMap[fileObj.type];
    let modifiedBase = `${baseUrl}/${namePrefix}:${epochTime}${extension}`;
    const uploadUrl = `${modifiedBase}?${queryParams}`;

    return fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': fileObj.type || 'application/octet-stream',
        },
        body: fileObj,
    })
        .then((response) => {
            if (response.ok) {
                return {
                    fileName: fileObj.name,
                    url: modifiedBase,
                    status: 'success',
                };
            } else {
                return response.text().then((errorText) => {
                    return {
                        fileName: fileObj.name,
                        url: modifiedBase,
                        status: 'failed',
                        error: errorText,
                    };
                });
            }
        })
        .catch((err) => {
            return {
                fileName: fileObj.name,
                url: modifiedBase,
                status: 'failed',
                error: err.message,
            };
        });
});

    const uploadResults = await Promise.all(uploadPromises);

    // Check for failed uploads
    const failedUploads = uploadResults.filter(
        (result) => result.status === 'failed',
    );
    if (failedUploads.length > 0) {
        return {
            success: false,
            DisplayMsg: `Some images failed to upload. Please retry.`,
            failedUploads,
        };
    }
    // Return the array of URLs if all uploads were successful
    return {
        success: true,
        urls: uploadResults.map((result) => result.url),
    };
}
async function convertHEICtoJPEG(file) {
    try {
        const heic2any = await import(
            'https://cdn.jsdelivr.net/npm/heic2any@0.0.3/+esm'
        );
        const blob = await heic2any.default({
            blob: file,
            toType: 'image/jpeg',
        });
        return new File([blob], file.name.replace('.heic', '.jpg'), {
            type: 'image/jpeg',
        });
    } catch (err) {
        throw new Error(err);
    }
}

export default { uploadImages, convertHEICtoJPEG };