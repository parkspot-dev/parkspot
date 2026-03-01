<template>
    <div class="custom-card skeleton-card">
        <div class="skeleton title"></div>
        <div class="skeleton line"></div>
        <div class="skeleton line short"></div>
    </div>
</template>

<style scoped>
.skeleton-card {
    height: 155px;
    width: 100%;
}

.skeleton {
    height: 14px;
    margin-bottom: 10px;
    border-radius: 4px;
    background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 37%,
        #f0f0f0 63%
    );
    background-size: 400% 100%;
    animation: shimmer 1.4s infinite;
}

.short {
    width: 60%;
}

@keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
}
</style>