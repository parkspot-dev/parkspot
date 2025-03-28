<template>
    <div class="upload-container">
        <div class="preview-row">
            <!-- Uploaded Images preview -->
            <div
                :key="index"
                class="preview-img"
                v-for="(img, index) in uploadImages"
            >
                <img :src="img.preview" alt="Preview" />
                <button @click="deleteImage(index)" class="delete-btn">
                    <AtomIcon icon="close" />
                </button>
            </div>

            <!-- Dropzone -->
            <div
                :class="{ dragging: isDragging }"
                @click="triggerFileInput"
                @dragleave.prevent="handleDragLeave"
                @dragover.prevent="handleDragOver"
                @drop.prevent="handleDrop"
                class="dropzone"
                v-if="uploadImages.length < maxImageCount"
            >
                <AtomIcon icon="image-plus" class="image-icon" />
                <input
                    @change="handleFileChange"
                    accept="image/png,image/jpeg"
                    aria-label="Upload images"
                    hidden
                    multiple
                    ref="fileInput"
                    type="file"
                />
            </div>
        </div>
    </div>
</template>

<script>
import AtomIcon from '@/components/atoms/AtomIcon.vue';
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];
export default {
    name: 'ImageUpload',
    components: { AtomIcon },
    props: {
        maxImageSize: {
            type: Number,
            default: 10 * 1024 * 1024, // Default 10MB
        },
        maxImageCount: {
            type: Number,
            default: 2,
        },
        ID: { type: String, default: undefined },
        startUpload: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // Structure of each uploaded image object:
            // {
            //   file: File,      // The original image file selected by the user (via file input or drag-and-drop)
            //   preview: string  // A Base64-encoded data URL generated using FileReader.readAsDataURL(file),
            //                    // allowing the image to be displayed in an <img> tag as a preview.
            // }
            uploadImages: [],
            isDragging: false,
        };
    },
    watch: {
        startUpload(liftoff) {
            if (liftoff) {
                this.submitUpload();
            }
        },
    },
    methods: {
        triggerFileInput() {
            if (this.uploadImages.length >= this.maxImageCount) {
                this.showDangerToast(
                    `Only ${this.maxImageCount} images are allowed to upload.`,
                );
                return;
            }
            this.$refs.fileInput.click();
        },
        handleDragOver() {
            this.isDragging = true;
        },
        handleDragLeave() {
            this.isDragging = false;
        },
        handleDrop(e) {
            this.isDragging = false;
            if (this.uploadImages.length >= this.maxImageCount) {
                this.showDangerToast(
                    `Only ${this.maxImageCount} images are allowed to upload.`,
                );
                return;
            }
            this.processFiles(Array.from(e.dataTransfer.files));
        },
        handleFileChange(e) {
            this.processFiles(Array.from(e.target.files));
            e.target.value = ''; // Reset input
        },
        processFiles(files) {
            if (!this.canAddMoreFiles()) return;

            const {
                validFiles,
                invalidFileFound,
                largeFileFound,
                duplicateFound,
            } = this.validateFiles(files);

            this.handleValidationErrors(
                invalidFileFound,
                largeFileFound,
                duplicateFound,
            );

            this.addValidFiles(validFiles);
        },

        canAddMoreFiles() {
            const remaining = this.maxImageCount - this.uploadImages.length;
            if (remaining <= 0) {
                this.showDangerToast(
                    `Only ${this.maxImageCount} images are allowed to upload.`,
                );
                return false;
            }
            return true;
        },

        validateFiles(files) {
            let validFiles = [];
            let invalidFileFound = false;
            let largeFileFound = false;
            let duplicateFound = false;

            files.forEach((file) => {
                if (!this.isFileTypeValid(file)) {
                    invalidFileFound = true;
                    return;
                }
                if (!this.isFileSizeValid(file)) {
                    largeFileFound = true;
                    return;
                }
                if (this.isDuplicateFile(file)) {
                    duplicateFound = true;
                    return;
                }
                validFiles.push(file);
            });

            return {
                validFiles,
                invalidFileFound,
                largeFileFound,
                duplicateFound,
            };
        },

        isFileTypeValid(file) {
            return ALLOWED_TYPES.includes(file.type);
        },

        isFileSizeValid(file) {
            return file.size <= this.maxImageSize;
        },

        isDuplicateFile(file) {
            return this.uploadImages.some(
                (img) =>
                    img.file.name === file.name &&
                    img.file.size === file.size &&
                    img.file.lastModified === file.lastModified,
            );
        },

        handleValidationErrors(
            invalidFileFound,
            largeFileFound,
            duplicateFound,
        ) {
            if (invalidFileFound) {
                this.showDangerToast(
                    `Only ${ALLOWED_TYPES.map((t) => t.split('/')[1].toUpperCase()).join(' or ')} images are allowed.`,
                );
            }
            if (largeFileFound) {
                this.showDangerToast(
                    `Each file must be ≤ ${(this.maxImageSize / (1024 * 1024)).toFixed(0)}MB.`,
                );
            }
            if (duplicateFound) {
                this.showDangerToast('Duplicate files are not allowed.');
            }
        },

        addValidFiles(validFiles) {
            const remaining = this.maxImageCount - this.uploadImages.length;
            const filesToAdd = validFiles.slice(0, remaining);

            filesToAdd.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadImages.push({ file, preview: e.target.result });
                };
                reader.readAsDataURL(file);
            });
        },

        deleteImage(index) {
            this.uploadImages.splice(index, 1);
        },

        // Gets sas-url to upload Images
        async getSasUrl() {
            return mayaClient.get('sas-url');
        },

        // Uploads images to the SAS URL with a unique filename format (`SpotRequestId:epochTime.extension`),
        // using parallel PUT requests and returning upload statuses.
        async uploadImages() {
            this.$emit('update:startUpload', false);
            const sas_url = await this.getSasUrl();
            if (sas_url.ErrorCode) {
                this.$emit('UploadImageURLs', {
                    success: false,
                    DisplayMsg: `Failed to fetch Sas URL`,
                });
                return;
            }
            const [baseUrl, queryParams] = sas_url.split('?');
            const uploadPromises = this.uploadImages.map(async (img) => {
                const epochTime = Date.now();
                let extension = '';
                if (img.file.type === 'image/png') {
                    extension = '.png';
                } else if (img.file.type === 'image/jpeg') {
                    extension = '.jpg';
                }

                const modifiedBase = `:${epochTime}${extension}`;
                if (this.ID !== undefined) {
                    modifiedBase = `${this.ID}${modifiedBase}`;
                }
                // Use this.spotId here
                // const modifiedBase = `${baseUrl}/${this.spotId}:${epochTime}${extension}`;
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
                this.$emit('UploadImageURLs', {
                    success: false,
                    DisplayMsg: `Some images failed to upload. Please retry.`,
                    failedUploads,
                });
                return;
            }
            // Return the array of URLs if all uploads were successful
            this.$emit('UploadImageURLs', {
                success: true,
                urls: uploadResults.map((result) => result.url),
            });
        },

        showDangerToast(message) {
            this.$buefy.toast.open({
                message,
                type: 'is-danger',
                duration: 2500,
            });
        },
    },
};
</script>

<style scoped>
.delete-btn {
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    border: none;
    color: var(--parkspot-white);
    cursor: pointer;
    display: flex;
    height: 20px;
    justify-content: center;
    position: absolute;
    right: 4px;
    top: 4px;
    transition: background 0.1s;
    width: 20px;
}
.delete-btn:hover {
    background: rgba(255, 0, 0, 0.8);
}
.dropzone {
    align-items: center;
    border-radius: 8px;
    border: 2px dashed var(--parkspot-black);
    cursor: pointer;
    display: flex;
    height: 88px;
    justify-content: center;
    padding: 4px;
    width: 88px;
}
.image-icon {
    color: var(--parkspot-black);
    font-size: 32px;
}
.preview {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin: 2px 0;
}
.preview-img {
    background-color: #f0f0f0;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    height: 88px;
    padding: 4px;
    position: relative;
    width: 88px;
}
.preview-img img {
    border-radius: 4px;
    height: 80px;
    object-fit: cover;
    width: 80px;
}
.preview-row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
}
.upload-container {
    background: #fff;
    border-radius: 4px;
    padding: 4px;
    text-align: center;
    width: 100%;
}
@media (max-width: 450px) {
    .upload-container {
        margin-bottom: 28px;
    }
    .preview-img {
        height: 68px;
        width: 68px;
    }
    .preview-img img {
        height: 72px;
        width: 72px;
    }
}
</style>
