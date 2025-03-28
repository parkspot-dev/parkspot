import { mayaClient } from "./api";
export default {
    methods: {
        // Gets sas-url to upload Images
        async getSasUrl() {
            return mayaClient.get('sas-url');
        },

        // Uploads images to the SAS URL with a unique filename format (`SpotRequestId:epochTime.extension`),
        // using parallel PUT requests and returning upload statuses.
        async uploadImages(Images, Id = null) {
            const sas_url = await this.getSasUrl();
            if (sas_url.ErrorCode) {
                return {
                    success: false,
                    DisplayMsg: `Failed to fetch sas URL`,
                };
            }
            const [baseUrl, queryParams] = sas_url.split('?');
            const uploadPromises = Images.map(async (img) => {
                const epochTime = Date.now();
                let extension = '';
                if (img.file.type === 'image/png') {
                    extension = '.png';
                } else if (img.file.type === 'image/jpeg') {
                    extension = '.jpg';
                }

                let modifiedBase = Id ? `${Id}:${epochTime}${extension}` : `${epochTime}${extension}`;
                const finalUrl = `${baseUrl}/${modifiedBase}?${queryParams}`;

                // Return fetch promise for each file
                return fetch(finalUrl, {
                    method: 'PUT',
                    headers: {
                        'x-ms-blob-type': 'BlockBlob',
                        'Content-Type':
                            img.file.type || 'application/octet-stream',
                    },
                    body: img.file,
                })
                    .then((response) => {
                        if (response.ok) {
                            return {
                                fileName: img.file.name,
                                url: modifiedBase,
                                status: 'success',
                            };
                        } else {
                            return response.text().then((errorText) => {
                                return {
                                    fileName: img.file.name,
                                    url: modifiedBase,
                                    status: 'failed',
                                    error: errorText,
                                };
                            });
                        }
                    })
                    .catch((err) => {
                        return {
                            fileName: img.file.name,
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
        },
    }
}