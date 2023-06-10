<template>
    <h2>Tool</h2>
    <div class="col-6">
        <select class="form-select" id="shape">
            <option value="mouse paint">Mouse Paint</option>
            <option value="rect">Recangle</option>
            <option value="ellipse">Circle</option>
        </select>
    </div>
    <div class="col-6">
        <select class="form-select" id="color">
            <option value="#000000">Black</option>
            <option value="#007fff">Blue</option>
            <option value="#fe0000">Red</option>
            <option value="#83f52c">Green</option>
        </select>
    </div>
</template>

<script>
export default {
    name: "ToolSelectorComponent"
}
</script>

<style scoped>

</style>