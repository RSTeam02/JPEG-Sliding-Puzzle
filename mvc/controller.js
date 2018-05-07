import { Shuffle } from "./shuffle.js";
import { TileMatrix } from "./tileMatrix.js";


/**
 * @author sakaijun
 * 
 * + every image will be displayed by standard resolution modes WxH dependent on browser window size
 * + (re)calculate height with ratio of width
 * + slice in rows and cols (rectangular too)
 * + add borders
 * + shuffle positions of sliced image
 * + assign listener to every tile
 * + swap css properties, when a tile is clicked next to gap (diff is always 1)
 * + mark gap
 *   
 */

export class Controller {

    constructor() {
        this.btnListener();
        let previewImg = new Image(640, 480);
        previewImg.src = "./images/IMG_0439.JPG";
        this.img = previewImg;
        this.sliceImg(false, true);

    }

    get row() {
        return $("#row").val();
    }

    get col() {
        return $("#col").val();
    }

    set img(pic) {
        this.pic = pic;
    }

    get img() {
        return this.pic;
    }

    get tile() {
        return document.body.querySelectorAll('.tile');
    }

    btnListener() {

        $(".MxN").on("click input", () => {
            $("#info").html("");
            this.sliceImg(false, true);
        });

        $("#undo").on("click", () => {
            $("#info").html("");
            this.sliceImg(false, true);
            $(".tile").off("click");
        });

        $("#rnd").on("click", () => {
            $("#info").html("");
            this.firstswapTile = true;
            this.sliceImg(true, false);
        });

        $("#readFile").on('change', () => {
            this.previewFile((res) => {
                this.img = res;
                this.sliceImg(false, true);
            });
        });
    }
    //assign listener to every tile, swapping is only allowed when the next one is a gap
    tileListener() {
        $(".tile").on("click", (e) => {
            let curr = e.currentTarget.id;
            let coordClick = curr.split("");
            let clickX = coordClick[0];
            let clickY = coordClick[1];
            let gapX = 0;
            let gapY = 0;
            let coordGap = [];


            for (let i = 0; i < this.tile.length; i++) {
                if ($(this.tile[i]).attr("value") === "gap") {
                    coordGap = this.tile[i].id.split("");
                    gapX = coordGap[0];
                    gapY = coordGap[1];
                    let abs = this.dist(clickX, clickY, gapX, gapY)
                    if (abs.absDist == 1) {
                        this.tileAnimate(this.tile[i].id, curr, abs.direction);
                    }
                }
            }
        });
    }
    //check if all tiles placed right
    evaluate(tile) {
        let tileLen = $("#row").val() * $("#col").val();
        let placedRight = 0;
        for (let j = 0; j < tile.length; j++) {
            if (`tile t${j}` === tile[j].className) {
                placedRight++;
                if (tileLen - 1 == placedRight) {
                    $("#info").html("Solved!");
                    $(`.tile.t${tileLen - 1}`).css({ "background-image": `url(${this.img.src})` });
                    $(".tile").off("click");
                }
            }
        }
    }
    //upload a jpeg image (optional)
    previewFile(cb) {
        var file = document.querySelector('input[type=file]').files[0];
        let reader = new FileReader();
        try {
            if (file.type == 'image/jpeg' || file.type == "image/gif" || file.type == "image/png" || file.type == "image/tiff") {
                reader.onload = function () {
                    let img = new Image();
                    img.src = reader.result;
                    img.onload = function () {
                        cb(img);
                    }
                }
            } else {
                throw "not an image file";
            }
            if (file) {
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.log(error);
        }
    }

    sliceImg(rnd, lastTile) {
        let tm = new TileMatrix();
        let arr = tm.createTileMat(this.row, this.col);
        let shuffle = new Shuffle();
        let shuffled = shuffle.randomOrder(arr, rnd);
        $("#dimInfo").html(`Format: ${this.row}x${this.col}`);
        var width = this.img.width;


        if (window.innerWidth >= 1920) {
            width = 1680;
        } else if (window.innerWidth >= 1680) {
            width = 1280;
        } else if (window.innerWidth >= 1280) {
            width = 1024;
        } else if (window.innerWidth >= 1024) {
            width = 800;
        } else if (window.innerWidth >= 800) {
            width = 640;
        } else if (window.innerWidth >= 640) {
            width = 480;
        } else {
            width = 320;
        }

        var ratio = this.img.width / width;
        var height = this.img.height / ratio;


        $('#fullIMG').css({
            "display": "none",
            "width": `${width}px`,
            "height": `${height}px`
        });
        $('.puzzle').css({
            "position": "relative",
            "width": `${width}px`,
            "height": `${height}px`
        });

        this.buildTile(width, height, shuffled, lastTile);
        this.tileListener();
    }

    //build Tiles of an image, the last one is always marked as "gap"
    buildTile(width, height, shuffled, lastTile) {
        let k = 0;
        var tNo = 0;
        var tWidth = 0;
        var tHeight = 0;
        var tileSet = "";
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                tileSet += `<div class="tile t${shuffled[k] - 1}" id="${i}${j}"></div>`;
                k++;
            }
        }
        $(".puzzle").html(tileSet);
        $('.tile').css({
            "width": `${Math.floor(width / this.col)}px`,
            "height": `${Math.floor(height / this.row)}px`,
            "float": "left",
            "position": "relative",
            "background-image": `url(${this.img.src})`,
            "background-size": `${width}px ${height}px`
        });

        for (var i = 0; i < this.row; i++) {
            tWidth = 0;
            for (var j = 0; j < this.col; j++) {
                $(`.tile.t${tNo}`).css({
                    "background-position": `${Math.floor(tWidth)}px ${Math.floor(tHeight)}px`
                });
                $(`.tile.t${tNo}`).attr("value", "");
                tWidth -= (width / this.col);
                tNo++;
            }
            tHeight -= (height / this.row);
        }
        if (!lastTile) {
            $(`.tile.t${this.row * this.col - 1}`).css({ "background-image": "none" });
            $(`.tile.t${this.row * this.col - 1}`).attr("value", "gap");
        }
    }
    //animate every tile related to direction
    tileAnimate(last, curr, direction) {
        let width = -parseInt($(`#${curr}`).css("width"));
        let height = -parseInt($(`#${curr}`).css("height"));

        if (direction == "top") {
            $(`#${curr}`).animate({ "top": height }, () => {
                $(`#${curr}`).css({ "top": "0px" });
                this.swapTile(last, curr);
            });
        }
        if (direction == "bottom") {
            $(`#${curr}`).animate({ "bottom": height }, () => {
                $(`#${curr}`).css({ "bottom": "0px" });
                this.swapTile(last, curr);
            });
        }
        if (direction == "left") {
            $(`#${curr}`).animate({ "left": width }, () => {
                $(`#${curr}`).css({ "left": "0px" });
                this.swapTile(last, curr);
            });
        }
        if (direction == "right") {
            $(`#${curr}`).animate({ "right": width }, () => {
                $(`#${curr}`).css({ "right": "0px" });
                this.swapTile(last, curr);
            });
        }

    }
    //swap css properties of two tiles, the neighbour is always empty
    swapTile(last, curr) {
        let gap = $(`#${last}`).css("background-position");
        let clicked = $(`#${curr}`).css("background-position");
        let classTemp = $(`#${curr}`).attr("class");
        $(`#${curr}`).css({
            "background-image": "none",
            "background-position": gap
        });
        $(`#${curr}`).attr("value", "gap");
        $(`#${curr}`).attr("class", $(`#${last}`).attr("class"));
        $(`#${last}`).css({ "background-position": clicked, "background-image": `url(${this.img.src})` });
        $(`#${last}`).attr("value", "");
        $(`#${last}`).attr("class", classTemp);
        this.evaluate(this.tile);

    }

    //return absolute distance, direction
    dist(x1, y1, x2, y2) {

        let distProp = {
            direction: "",
            absDist: 0
        }

        if ((x1 - x2) === 1) {
            distProp.direction = "top";
        }
        if ((x1 - x2) === -1) {
            distProp.direction = "bottom";
        }
        if ((y1 - y2) === 1) {
            distProp.direction = "left";
        }
        if ((y1 - y2) === -1) {
            distProp.direction = "right";
        }
        distProp.absDist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
        
        return distProp;
    }
}