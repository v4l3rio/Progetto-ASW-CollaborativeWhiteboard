<template>
    <div class="draw">

        <div class="toolbar" :style="{ right: toolBarRight }">

            <div class="allColors">

                <div class="panelUp mobile"></div>

                <transition-group class="lineColor" name="color-list" tag="ul">
                    <li v-for="(color, $index) in colors" v-bind:style='{ "background-color": color }'
                        v-on:click="changeLineColor(color, $index)" v-bind:key="color"></li>
                </transition-group>


                <transition-group class="bgColor" name="color-list" tag="ul">
                    <li v-for="(color, $index) in bgColors" v-bind:key="color"
                        v-bind:style='{ "background-color": color }' @click="changeBg(color, $index)"></li>
                </transition-group>

            </div>

        </div>

        <!--     <ul class="toolbar" v-bind:style='{ "background-color": bgColor }'>
              <li v-for="color in colors" v-bind:style='{ "background-color": color }' v-on:click="changeLineColor(color)" v-bind:key="color"></li>
              <li class="bgColor" v-bind:style='{ "background-color": bgColor }' @click="changeBg()" ></li>
            </ul> -->

        <div class="buttons" v-bind:class="{ showButtons: undo }">
            <button v-on:click="download()" class="btn submitBtn"><img src="../assets/download.svg" alt="Download">
            </button>
            <button v-on:click="clean()" class="btn clearBtn"><img src="../assets/clear.svg" alt="Clear Canvas">
            </button>
            <UndoStack ref="undoStack"></UndoStack>
        </div>

        <div class="canvas">

            <!-- Canvas size is defined in CSS, search for ".canvas" -->

            <svg xmlns=http://www.w3.org/2000/svg version="1.1" class="drawSvg" :width="canvasWidth"
                 :height="canvasHeight"
                 @mousedown="lineStart({x: null, y:null})"
                 @touchstart="lineStart({x: null, y:null})"
                 @mousemove="lineMove({x: null, y:null})"
                 @touchmove="lineMove({x: null, y:null})"
                 @mouseup="lineEnd({x: null, y:null})"
                 @touchend="lineEnd({x: null, y:null})"
                 @onmouseleave="outOfCanvas()"
                 @touchcancel="outOfCanvas()"
            >

                <rect id="bg" width="100%" height="100%" v-bind:fill="bgColor"></rect>
                <Interpolation ref="interpolation"></Interpolation>
            </svg>

            <div id="cursor" v-bind:style='{ "background-color": lineColor }'></div>

        </div>


    </div>
    <SocketComponent ref="socket"
                     v-on:drawStartBC="lineStart"
                     v-on:drawingBC="lineMove"
                     v-on:drawEndBC="lineEnd"
    ></SocketComponent>
</template>

<script>
import Interpolation from "@/components/Interpolation.vue";
import {arrayMove, rgb2hex} from "@/scripts/utility";
import UndoStack from "@/components/UndoStack.vue";
import SocketComponent from "@/components/SocketComponent.vue";

require('../assets/css/freehandDraw.css')

// hello jquery
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export default {
    name: 'WhiteboardComponent',
    components: {SocketComponent, UndoStack, Interpolation},
    props: [
        'title',
        'colors',
        'bgColors',
        'lineColor',
        'bgColor',
    ],
    data() {
        return {
            board: '',
            cursor: '',
            colorNum: 0,
            gesture: false,
            line: '',
            radius: 2.5,
            width: 8,
            undo: false,
            onCanvas: false, // mouseout event is not firing, dunno why,
        }
    },

    computed: {

        canvasWidth: function () {
            return this.board.clientWidth
        },

        canvasHeight: function () {
            return this.board.clientHeight
        },

        toolBarRight: {
            get: function () {
                return -this.colors.length * 51.5 + 'px'
            },

        }

    },

    methods: {

        initBoard: function () {
            this.board = $('.drawSvg')
            this.cursor = $('#cursor')
            this.gesture = false

        },

        lineStart: function (data) {

            this.undo = true;

            let e = event

            let cursorX;
            let cursorY;
            let rect = this.board.getBoundingClientRect();
            if(data.y !== null && data.x!== null){
                cursorX = Math.round(data.x - rect.x) || Math.round(e.changedTouches[0].clientX - rect.x)
                cursorY = Math.round(data.y - rect.y) || Math.round(e.changedTouches[0].clientY - rect.y)
            } else {
                cursorX = Math.round(e.clientX - rect.x) || Math.round(e.changedTouches[0].clientX - rect.x)
                cursorY = Math.round(e.clientY - rect.y) || Math.round(e.changedTouches[0].clientY - rect.y)
                this.$refs.socket.drawStart(cursorX, cursorY);
            }

            this.line += 'M' + cursorX + ',' + cursorY

            this.$refs.interpolation.createInterpolatingPath("interpolation1", this.lineColor); // todo switch id based on the remote user who is drawing

            this.cursor.style.opacity = 0.5
            this.gesture = true
            e.preventDefault()
        },

        lineMove: function (data) {

            let e = event
            let rect = this.board.getBoundingClientRect();
            let cursorX;
            let cursorY;
            if(data.y !== null && data.x !== null){
                cursorX = Math.round(data.x - rect.x) || Math.round(e.changedTouches?[0].clientX - rect.x : -1)
                cursorY = Math.round(data.y - rect.y) || Math.round(e.changedTouches?[0].clientY - rect.y : -1)
            } else {
                cursorX = Math.round(e.clientX - rect.x) || Math.round(e.changedTouches ? [0].clientX - rect.x : -1)
                cursorY = Math.round(e.clientY - rect.y) || Math.round(e.changedTouches ? [0].clientY - rect.y : -1)
            }
            if (this.gesture === true) {
                this.line += 'L' + cursorX + ',' + cursorY
                if(data.y === null && data.x === null) {
                    this.$refs.socket.drawing(cursorX, cursorY);
                }
                // this.line += 'L'+(e.clientX||e.touches[0].clientX)+','+(e.clientY||e.touches[0].clientY)+' '
                const x = (e.clientX || e.touches[0].clientX);
                const y = (e.clientY || e.touches[0].clientY);
                this.trace(x, y);
                this.$refs.interpolation.interpolate(cursorX, cursorY, "interpolation1") // todo switch id based on the remote user who is drawing
            }

            this.cursor.style.top = e.clientY - rect.y - this.radius + 'px'
            this.cursor.style.left = e.clientX - rect.x - this.radius + 'px'

            this.cursorX = e.clientX - rect.x
            this.cursorY = e.clientY - rect.y

            this.onCanvas = true
        },

        trace: function (x, y) {
            let dot = document.createElement('div');
            dot.classList.add('dot')
            dot.style.top = y - this.radius + 'px';
            dot.style.left = x - this.radius + 'px';
            dot.style.background = this.lineColor;
            dot.style.width = dot.style.height = this.radius * 2 + 'px';
            document.body.appendChild(dot);
            //setTimeout(function(){dot.style.opacity=0},500);
            //setTimeout(function(){document.body.removeChild(dot)},1000);
        },

        lineEnd: function (data) {

            let e = event;
            let cursorX;
            let cursorY;
            let rect = this.board.getBoundingClientRect();
            if(data.y !== null && data.x!== null){
                cursorX = Math.round(data.x - rect.x) || Math.round(e.changedTouches[0].clientX - rect.x)
                cursorY = Math.round(data.y - rect.y) || Math.round(e.changedTouches[0].clientY - rect.y)
            } else {
                cursorX = Math.round(e.clientX - rect.x) || Math.round(e.changedTouches[0].clientX - rect.x)
                cursorY = Math.round(e.clientY - rect.y) || Math.round(e.changedTouches[0].clientY - rect.y)
                this.$refs.socket.drawEnd(cursorX, cursorY);
            }


            this.line += 'L' + cursorX + ',' + cursorY;
            this.cursor.style.opacity = .5
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttributeNS(null, 'd', this.line);
            path.setAttributeNS(null, 'fill', 'none');
            path.setAttributeNS(null, 'stroke-linecap', 'round');
            path.setAttributeNS(null, 'stroke-linejoin', 'round');
            path.setAttributeNS(null, 'stroke', this.lineColor);

            const id = Math.floor(Math.random() * 1000);  // todo interrogate server for retaining fresh ids
            path.setAttribute("id", id);
            this.$refs.undoStack.addLine(id);

            path.setAttributeNS(null, 'stroke-width', this.width);
            this.board.appendChild(path);
            this.$refs.interpolation.deleteInterpolatingPath("interpolation1")
            // this.board.innerHTML = this.board.innerHTML // force SVG repaint after DOM change
            this.gesture = false;
            this.line = '';

            const dots = document.getElementsByClassName("dot");
            while (dots[0]) {
                dots[0].parentNode.removeChild(dots[0]);
            }

        },

        setActiveColor: function (Li) {
            let allColors = $$(Li)
            let target = event.target // for set time out

            for (let color of allColors) {
                color.classList.remove('activeColor')
            }

            setTimeout(function () {
                target.classList.add('activeColor')
            }, 10)
        },

        setActiveColorMounted: function (li, arr, color) {

            let allLi = $$(li)
            let colorIndex = arr.indexOf(color)

            for (let li of allLi) {
                let liColor = rgb2hex(li.style.backgroundColor).toUpperCase()

                if (liColor === color) {
                    li.classList.add('activeColor')

                    arrayMove(arr, colorIndex, 0)
                }
            }
        },

        changeLineColor(color, index) {
            window.scrollTo({top: 0, behavior: 'smooth'});

            this.$emit('changeLineColor', color)

            this.setActiveColor('.lineColor li')

            // changing circle position
            arrayMove(this.colors, index, 0)
        },

        changeBg(color, index) { // just change backgrounds colors one after another
            window.scrollTo({top: 0, behavior: 'smooth'});

            this.$emit('changeBgColor', color)

            this.setActiveColor('.bgColor li')

            $('.drawSvg #bg').setAttribute('fill', this.bgColor)

            arrayMove(this.bgColors, index, 0)

            // this.board.innerHTML = this.board.innerHTML // force SVG repaint after DOM change

        },



        clean: function () {
            this.line = '';
            this.undo = false;

            let paths = $$('.drawSvg path').length

            let i = 0

            for (i = 0; i < paths; i++) {
                this.board.removeChild(this.board.querySelectorAll('path')[0])
            }

            // this.board.innerHTML = ''; more effective, but removes bg also

        },

        download: function () {
            var dl = document.createElement("a");

            let drawing = this.svgDataURL($('.drawSvg'))

            console.log(drawing)

            document.body.appendChild(dl); // This line makes it work in Firefox.
            dl.setAttribute("href", drawing)
            dl.setAttribute("download", "freehand-svg-drawing.svg");
            dl.click();
        },


        svgDataURL: function () {
            // let drawSvg = new XMLSerializer().serializeToString(this.board)
            let serialSvg = (new XMLSerializer).serializeToString(this.board);
            return "data:image/svg+xml," + encodeURIComponent(serialSvg);


            // this.$emit('drawSubmit', drawSvg);
        },


    },

    mounted: function () {
        this.initBoard()
        this.setActiveColorMounted('.lineColor li', this.colors, this.lineColor)
        this.setActiveColorMounted('.bgColor li', this.bgColors, this.bgColor)


    },

}
</script>
