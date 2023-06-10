<template>
    <div class="row p-4">
        <div class="col-8"><WhiteboardComponent v-bind:title="drawProps.title"
                                                v-bind:colors="drawProps.colors"
                                                v-bind:bgColors="drawProps.bgColors"
                                                v-bind:lineColor = "drawProps.lineColor"
                                                v-bind:bgColor = "drawProps.bgColor"
                                                v-on:changeLineColor = "changeLineColor"
                                                v-on:changeBgColor = "changeBgColor"
                                                v-on:drawSubmit="saveDrawing"></WhiteboardComponent></div>
        <div class="col-4">
            <div class="row">
            <ToolSelectorComponent/>
            </div>
            <div class="row pt-3">
            <ActiveUserInWhiteboard/>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import WhiteboardComponent from '@/components/WhiteboardComponent.vue'
import ToolSelectorComponent from "@/components/ToolSelectorComponent.vue";
import ActiveUserInWhiteboard from "@/components/ActiveUserInWhiteboard.vue";

export default {
  name: 'WhiteboardView',
  components: {
      WhiteboardComponent,
      ToolSelectorComponent,
      ActiveUserInWhiteboard
  },
    data() {
        return {
            drawProps:
                {
                    title: "Freehand SVG Draw",
                    colors: ['#EAEAEA','#292929', '#00A0FF', '#FF29AA', '#FFE500', '#FF3030', '#12EB0A'],
                    bgColors: ['#EAEAEA','#292929', '#00A0FF', '#FF29AA', '#FFE500', '#FF3030', '#12EB0A'],
                    lineColor: "#292929",
                    bgColor: "#EAEAEA"
                }

        }
    },

    methods: {
        changeLineColor: function(color){
            this.drawProps.lineColor = color;
        },

        changeBgColor: function(color){
            this.drawProps.bgColor = color;
        },

        saveDrawing: function(drawSvg){
            console.log (drawSvg)
        }
    },

    mounted: function() {
    }

}
</script>
