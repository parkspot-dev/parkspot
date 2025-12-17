<template>
    <div class="upload-container">
        <div class="preview-row">
            <!-- Uploaded Images preview -->
            <div
                v-for="(img, index) in uploadImages"
                :key="index"
                class="preview-img"
            >
                <img :src="img.preview" alt="Preview" />
                <button class="delete-btn" @click="deleteImage(index)">
                    <AtomIcon icon="close" />
                </button>
            </div>

            <!-- Dropzone -->
            <div
                v-if="uploadImages.length < maxImageCount"
                :class="{ dragging: isDragging }"
                class="dropzone"
                @click="triggerFileInput"
                @dragleave.prevent="handleDragLeave"
                @dragover.prevent="handleDragOver"
                @drop.prevent="handleDrop"
            >
                <AtomIcon icon="image-plus" class="image-icon" />
                <input
                    ref="fileInput"
                    accept="image/png,image/jpeg,.heic"
                    aria-label="Upload images"
                    hidden
                    multiple
                    type="file"
                    @change="handleFileChange"
                />
            </div>
        </div>
        <LoaderModal v-if="isLoading"></LoaderModal>
    </div>
</template>

<script>
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import ImageUploadService from '@/services/ImageUploadService';
import LoaderModal from '@/components/extras/LoaderModal.vue';
const ALLOWED_TYPES = ['image/png', 'image/jpeg', '.heic'];
export default {
    name: 'ImageUpload',
    components: {
        AtomIcon,
        LoaderModal,
    },
    props: {
        maxImageSize: {
            type: Number,
            default: 10 * 1024 * 1024, // Default 10MB
        },
        maxImageCount: {
            type: Number,
            default: 4,
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
            isLoading: false,
            // Array to store HEIC format images before conversion
            heicFormatImages: [],
        };
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
            this.validateFileUpload(Array.from(e.dataTransfer.files));
        },
        handleFileChange(e) {
            if(e.target.files.length > this.maxImageCount){
                this.showDangerToast(
                    `Only ${this.maxImageCount} images are allowed to upload.`,
                );
                return;
            }
            this.validateFileUpload(Array.from(e.target.files));
            e.target.value = ''; // Reset input
        },
        async validateFileUpload(files) {
            if (!this.canAddMoreFiles()) return;
            files = files.filter((file) => {
                if (file.name.endsWith('.heic')) {
                    if (this.checkDuplicateforHeicFormat(file)) {
                        this.showDangerToast(
                            'Duplicate files are not allowed.',
                        );
                        return false;
                    } else {
                        this.heicFormatImages.push(file);
                    }
                }
                return true;
            });

            const {
                validFiles,
                invalidFileFound,
                largeFileFound,
                duplicateFound,
            } = await this.validateFiles(files);

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

        async validateFiles(files) {
            const validFiles = [];
            let invalidFileFound = false;
            let largeFileFound = false;
            let duplicateFound = false;

            for (let file of files) {
                if (this.isDuplicateFile(file)) {
                    duplicateFound = true;
                    continue;
                }
                if (!this.isFileTypeValid(file)) {
                    invalidFileFound = true;
                    continue;
                }
                if (!this.isFileSizeValid(file)) {
                    largeFileFound = true;
                    continue;
                }
                if (file.name.endsWith('.heic')) {
                    this.isLoading = true;
                    try {
                        file = await ImageUploadService.convertHEICtoJPEG(file);
                    } catch (error) {
                        this.showDangerToast(
                            'Unable to upload file. Please try again',
                        );
                    } finally {
                        this.isLoading = false;
                    }
                }
                validFiles.push(file);
            }

            return {
                validFiles,
                invalidFileFound,
                largeFileFound,
                duplicateFound,
            };
        },

        isFileTypeValid(file) {
            // heic format images file type is nil for some browsers
            // so we check the file extension as well
            const extension = file.name.split('.').pop().toLowerCase();
            return ALLOWED_TYPES.includes(file.type) || extension === 'heic';
        },

        isFileSizeValid(file) {
            return file.size <= this.maxImageSize;
        },

        isDuplicateFile(file) {
            return this.uploadImages.some(
                (img) =>
                    img.file.name === file.name && img.file.size === file.size,
            );
        },

        checkDuplicateforHeicFormat(file) {
            return this.heicFormatImages.some(
                (img) => img.name === file.name && img.size === file.size,
            );
        },

        handleValidationErrors(
            invalidFileFound,
            largeFileFound,
            duplicateFound,
        ) {
            if (invalidFileFound) {
                this.showDangerToast(
                    `Only ${ALLOWED_TYPES.map((t) => t.replace('image/', '').toUpperCase()).join(' or ')} images are allowed.`,
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
                    this.$emit('update:images', this.uploadImages);
                };
                reader.readAsDataURL(file);
            });
        },

        deleteImage(index) {
            this.uploadImages.splice(index, 1);
            this.$emit('update:images', this.uploadImages);
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
