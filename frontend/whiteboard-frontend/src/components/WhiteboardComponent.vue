<template>
    <div class="position-fixed w-100">
        <Alert class="w-75 text-center d-inline-block" v-if="alertOn" :text="alertText" :close-click="() => {alertOn = false;}"></Alert>
        <BigGlowingSpinner v-if="loading" class="align-content-center"></BigGlowingSpinner>
    </div>
    <div v-bind:class="{'visually-hidden': this.loading || this.error}"  class="draw">
        <!--     <ul class="toolbar" v-bind:style='{ "background-color": bgColor }'>
              <li v-for="color in colors" v-bind:style='{ "background-color": color }' v-on:click="changeLineColor(color)" v-bind:key="color"></li>
              <li class="bgColor" v-bind:style='{ "background-color": bgColor }' @click="changeBg()" ></li>
            </ul> -->

        <div class="buttons" v-bind:class="{ showButtons: undo }">
            <button v-on:click="download()" class="btn submitBtn"><img src="../assets/download.svg" alt="Download">
            </button>
            <button v-on:click="clean()" style="margin-right: 6vh" class="btn clearBtn"><img src="../assets/clear.svg" alt="Clear Canvas">
            </button>
            <ActiveUserInWhiteboard/>
            <UndoStack @undo-line="undoLine" ref="undoStack"></UndoStack>
        </div>

        <div class="canvas rounded shadow ">

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
                <g v-html="paths"></g>
            </svg>

            <div id="cursor" v-bind:style='{ "background-color": lineColor }'></div>

        </div>

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

    </div>
    <SocketComponent ref="socket"
                     v-on:whiteboardJoined="onJoinedWhiteboard"
                     v-on:drawStartBC="remoteLineStart"
                     v-on:drawingBC="remoteLineMove"
                     v-on:drawEndBC="remoteLineEnd"
                     v-on:lineDeleteBC="remoteLineDelete"
                     :whiteboard-id="this.$route.params.id"
    ></SocketComponent>
</template>

<script>
import Interpolation from "@/components/Interpolation.vue";
import {arrayMove, rgb2hex} from "@/scripts/utility";
import UndoStack from "@/components/UndoStack.vue";
import SocketComponent from "@/components/SocketComponent.vue";
import Spinner from "@/components/Spinner.vue";
import BigGlowingSpinner from "@/components/BigGlowingSpinner.vue";
import axios from "axios";
import Alert from "@/components/Alert.vue";
import {traitToPaths} from "@/scripts/whiteboard/pointsToSvg";
import ActiveUserInWhiteboard from "@/components/ActiveUserInWhiteboard.vue";

require('../assets/css/freehandDraw.css')

// hello jquery
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export default {
    name: 'WhiteboardComponent',
    components: {ActiveUserInWhiteboard, Alert, BigGlowingSpinner, Spinner, SocketComponent, UndoStack, Interpolation},
    emits: ['setLoading', 'changeLineColor', "changeBgColor", "drawSubmit"],
    props: [
        'title',
        'colors',
        'bgColors',
        'lineColor',
        'bgColor',
    ],
    data() {
        return {
            whiteboardJoined: false,
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
            drawingId: "",
            loading: true,
            alertOn: false,
            error: false,
            alertText: "",
            paths: ""
        }
    },

    computed: {

        canvasWidth: function () {
            return this.board?.clientWidth
        },

        canvasHeight: function () {
            return this.board?.clientHeight
        },

        toolBarRight: {
            get: function () {
                return -this.colors.length * 51.5 + 'px'
            },
        }
    },
  mounted() {
    this.$refs.socket.connect()
  },

    methods: {
        onJoinedWhiteboard(status) {
            if (status === 'ok') {
                this.whiteboardJoined = true;
                this.initBoard()
            } else if (status === "ko") {
                console.log("ERRORE nel connettersi alla lavagna")
                this.error = true;
                this.showAlert("There was an error. Maybe expired Token");
                this.loading = false;
            }
        },

        initBoard: function () {
          console.log("ehi")
            this.board = $('.drawSvg')
            this.cursor = $('#cursor')
            axios.get(`http://localhost:4000/whiteboard/${this.$route.params.id}`, {
                params: {
                    accessToken: localStorage.getItem("accessToken")
                }
            }).then(result => {
                console.log(result.data)
                const traits = result.data.whiteboardData.traits;
                this.$emit('setLoading', {loading:false, err: false});
                if (traits) {
                    for (const id in traits) {
                        const trait = traits[id];
                        this.paths += traitToPaths(trait, this.board, id).outerHTML
                    }
                    this.error = false;
                }
                this.loading = false;
            }).catch(error => {
                console.log(error)
                this.showAlert(error.response?.data?.message)
                this.$emit('setLoading', {loading:false, err: true});
                this.loading = false;
                this.error = true;
            })
            this.gesture = false
            this.setActiveColorMounted('.lineColor li', this.colors, this.lineColor)
            this.setActiveColorMounted('.bgColor li', this.bgColors, this.bgColor)
        },

        showAlert(text) {
            this.alertText = text;
            this.alertOn = true;
        },

        lineStart: function () {

            if (!this.whiteboardJoined) {return}

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

            if (!this.whiteboardJoined) {return}

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

            if (!this.whiteboardJoined) {return}

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

        undoLine: function(id) {

            if (!this.whiteboardJoined) {return}

            document.getElementById(id).remove(); // todo also removes on all clients and server, so it must broadcast this change
            this.$refs.socket.undoLine(id);
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
        remoteLineDelete: function(data) {
            document.getElementById(data.id).remove();
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



}
</script>

