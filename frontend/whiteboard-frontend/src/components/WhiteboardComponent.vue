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

        <div class="canvas rounded shadow">

            <!-- Canvas size is defined in CSS, search for ".canvas" -->

            <svg xmlns=http://www.w3.org/2000/svg version="1.1" class="drawSvg" :width="canvasWidth"
                 :height="canvasHeight"
                 @mousedown="lineStart()"
                 @touchstart="lineStart()"
                 @mousemove="lineMove()"
                 @touchmove="lineMove()"
                 @mouseup="lineEnd()"
                 @touchend="lineEnd()"
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
                     v-on:drawStartBC="remoteLineStart"
                     v-on:drawingBC="remoteLineMove"
                     v-on:drawEndBC="remoteLineEnd"
                     :whiteboard-id="this.$route.params.id"
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
            undo: true,
            onCanvas: false, // mouseout event is not firing, dunno why,
            lineToSend: [],
            drawingId: ""
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

        lineStart: function () {

            this.undo = true;

            let e = event

            let cursorX;
            let cursorY;
            let rect = this.board.getBoundingClientRect();

            this.lineToSend.push({x: e.clientX || e.changedTouches[0].clientX, y: e.clientY || e.changedTouches[0].clientY});
            cursorX = Math.round(e.clientX - rect.x) || Math.round(e.changedTouches[0].clientX - rect.x)
            cursorY = Math.round(e.clientY - rect.y) || Math.round(e.changedTouches[0].clientY - rect.y)
            this.$refs.socket.drawStart(e.clientX, e.clientY, this.lineColor);


            this.line += 'M' + cursorX + ',' + cursorY


            this.cursor.style.opacity = 0.5
            this.gesture = true
            e.preventDefault()
        },

        lineMove: function () {

            let e = event
            let rect = this.board.getBoundingClientRect();
            let cursorX;
            let cursorY;


            cursorX = Math.round(e.clientX - rect.x) || Math.round(e.changedTouches ? [0].clientX - rect.x : -1)
            cursorY = Math.round(e.clientY - rect.y) || Math.round(e.changedTouches ? [0].clientY - rect.y : -1)

            if (this.gesture === true) {
                this.line += 'L' + cursorX + ',' + cursorY
                this.$refs.socket.drawing(e.clientX, e.clientY);

                // this.line += 'L'+(e.clientX||e.touches[0].clientX)+','+(e.clientY||e.touches[0].clientY)+' '
                const x = (e.clientX || e.touches[0].clientX);
                const y = (e.clientY || e.touches[0].clientY);
                this.trace(x, y);
                this.lineToSend.push({x: e.clientX || e.changedTouches[0].clientX, y: e.clientY || e.changedTouches[0].clientY});
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

        lineEnd: function () {

            let e = event;
            let cursorX;
            let cursorY;
            let rect = this.board.getBoundingClientRect();

            cursorX = Math.round(e.clientX - rect.x) || Math.round(e.changedTouches[0].clientX - rect.x)
            cursorY = Math.round(e.clientY - rect.y) || Math.round(e.changedTouches[0].clientY - rect.y)

            this.$refs.socket.drawEnd(this.lineToSend, this.lineColor);

            this.line += 'L' + cursorX + ',' + cursorY;
            this.cursor.style.opacity = .5
            const id = this.$refs.socket.drawingId;  // taken from the socket component, just updated with the new id

            this.createPath(id, this.line, this.lineColor, this.width);
            // TODO broadcast all the points added
            // this.board.innerHTML = this.board.innerHTML // force SVG repaint after DOM change
            this.gesture = false;
            this.line = '';
            this.lineToSend = [];
            const dots = document.getElementsByClassName("dot");
            while (dots[0]) {
                dots[0].parentNode.removeChild(dots[0]);
            }

        },

        remoteLineStart: function (data) {
            //console.log("Line start" + JSON.stringify(data))
            if (data.id !== undefined) {
                //console.log("Line start with ID")
                this.$refs.interpolation.createInterpolatingPath(data.id, data.color);
            }
        },
        remoteLineMove: function (data) {
            //console.log("Line Move" +JSON.stringify(data))
            if (data.id && data.point) {
                //console.log(`Line move with point : ${data}`)

                const point = this.getCursors(data.point.x, data.point.y)
                this.$refs.interpolation.interpolate(point.x, point.y, data.id)
            }
        },
        remoteLineEnd: function (data) {
            //console.log("Line end")
            if (data.id && data.points) {
                //console.log(`Line end with data ${data}`)

                this.$refs.interpolation.deleteInterpolatingPath(data.id);

                let remoteLine = "";
                let point = this.getCursors(data.points[0].x, data.points[0].y);
                //console.log(point);
                remoteLine += 'M' + point.x + ',' + point.y;
                data.points.splice(0, 1);
                data.points.forEach(p => {
                    point = this.getCursors(p.x, p.y);
                    remoteLine += 'L' + point.x + ',' + point.y;
                })
                //console.log("Linea "+remoteLine);
                const id = data.id;
                this.createPath(id, remoteLine, data.color, this.width);
                remoteLine = "";
                data.points = [];
            }
        },

        createPath: function(id, line, lineColor, width){
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttributeNS(null, 'd', line);
            path.setAttributeNS(null, 'fill', 'none');
            path.setAttributeNS(null, 'stroke-linecap', 'round');
            path.setAttributeNS(null, 'stroke-linejoin', 'round');
            path.setAttributeNS(null, 'stroke', lineColor);
            path.setAttribute("id", id);
            this.$refs.undoStack.addLine(id);
            path.setAttributeNS(null, 'stroke-width', width);
            this.board.appendChild(path);
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

        getCursors(x,y) {
            const point = {}
            let rect = this.board.getBoundingClientRect();
            point.x = Math.round(x - rect.x)
            point.y = Math.round(y - rect.y)
            return point;
        }


    },

    mounted: function () {
        this.initBoard()
        this.setActiveColorMounted('.lineColor li', this.colors, this.lineColor)
        this.setActiveColorMounted('.bgColor li', this.bgColors, this.bgColor)
    },

    quit: function () {
        console.log("Sto seriamente sloggando")
    }

}
</script>
