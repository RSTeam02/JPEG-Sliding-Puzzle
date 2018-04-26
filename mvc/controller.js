import {Shuffle} from "./shuffle.js";
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

export class Controller{

    constructor(){
        this.btnListener(); 
        
    }
    
    get row(){
        return $("#row").val();
    }

    get col(){
        return $("#col").val();
    }

    get img(){
        return document.getElementById('fullIMG'); 
    }

    btnListener(){

        $(".MxN").on("click input", () =>{     
            $(".tile").remove();        
            $("#info").html(""); 
            this.sliceImg(false, true);
        });

        $("#undo").on("click", () =>{     
            $(".tile").remove();
            $("#info").html("");
            this.sliceImg(false, true);
            $(".tile").off("click");
        });

        $("#rnd").on("click", () =>{
            $("#info").html("");
            $(".tile").remove();            
            this.sliceImg(true, false);
        });

        $("#readFile").on('change', () => {             
            this.previewFile((res)=>{        
                $(".tile").remove();            
                $('.puzzle').html('<img id="fullIMG"/>');                  
                $('#fullIMG').attr("src", res); 
                setTimeout(() => {
                    this.sliceImg(false, true);  
                }, 10);                                                        
            });
        });   
    }  
    //assign listener to every tile, swapping is only allowed when the next one is a gap
    tileListener(){
        $(".tile").on("click", (e)=>{
            let curr = e.currentTarget.id;
            let coordClick = curr.split("");
            let clickX = coordClick[0];
            let clickY = coordClick[1];
            let gapX = 0;
            let gapY = 0;
            let coordGap = [];       
            let x = document.body.querySelectorAll('.tile');
        
            for(let i=0; i < x.length; i++) {              
                if($(x[i]).attr("value") === "gap"){
                    coordGap = x[i].id.split("");
                    gapX = coordGap[0];
                    gapY = coordGap[1];                   
                    if (this.dist(clickX, clickY, gapX, gapY) == 1) {                        
                        this.swapTile(x[i].id, curr);
                        this.evaluate(x);                                               
                    }
                }
            }    
        });
    }
    //check if all tiles placed right
    evaluate(tile){
        let tileLen = $("#row").val()*$("#col").val();
        let placedRight = 0;
        for(let j=0; j < tile.length; j++) {
            if(`tile t${j}` === tile[j].className){
                placedRight++; 
                if(tileLen -1 == placedRight){
                    $("#info").html("Solved!");
                    $(`.tile.t${tileLen-1}`).css({"background-image":`url(${this.img.src})`}); 
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
            if (file.type !== 'image/jpeg') {
                throw "not a jpeg image";
            } else {
                reader.onload = function() {
                    cb(reader.result);
                }
            }
            if(file){
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.log(error);
        }
    }

    sliceImg(rnd, lastTile){        
        let tm = new TileMatrix();
        let arr = tm.createTileMat(this.row, this.col);
        $('#fullIMG').css({ "display": "inline" });                          
        let shuffle = new Shuffle();
        let shuffled = shuffle.randomOrder(arr, rnd);      
              
        $("#dimInfo").html(`Format: ${this.row}x${this.col}`); 
        var width =this.img.clientWidth;

        
        if(window.innerWidth >= 1920){
            width = 1680;
        }else if(window.innerWidth >= 1680){
            width = 1280;
        }else if(window.innerWidth >= 1280){
            width = 1024;
        }else if(window.innerWidth >= 1024){
            width = 800;
        }else if(window.innerWidth >= 800){
            width = 640;
        }else if(window.innerWidth >= 640){
            width = 480;
        }else{
            width =320;
        }
        

        var ratio = this.img.clientWidth/width;
        var height = this.img.clientHeight/ratio;

        
        $('#fullIMG').css({ 
            "display": "none", 
            "width" : `${width}px`, 
            "height" : `${height}px` 
        });       
        $('.puzzle').css({          
            "position": "relative",
            "width":`${width}px`,
            "height":`${height}px`    
        });
        
        this.buildTile(width, height, shuffled, lastTile);      
        this.tileListener();
    }

    //build Tiles of an image, the last one is always marked as "gap"
    buildTile(width, height, shuffled, lastTile){
        let k = 0;
        var tNo =0;
        var tWidth =0;
        var tHeight = 0;
        for (let i = 0; i < this.row; i++){
            for (let j = 0; j < this.col; j++){
                $(".puzzle").append(`<div class="tile t${shuffled[k] - 1}" id="${i}${j}"></div>`);         
                k++;
            }
        }

        $('.tile').css({
            "width": `${Math.floor(width/this.col)-2}px`,
            "height": `${Math.floor(height/this.row)-2}px`,
            "float": "left",            
            "border": "1px solid black",
            "background-image":`url(${this.img.src})`,
            "background-size": `${width}px ${height}px`
        });        
       
        for (var i =0; i<this.row; i++){
            tWidth =0;
            for (var j =0; j<this.col; j++){
                $(`.tile.t${tNo}`).css({ 
                    "background-position": `${Math.floor(tWidth)}px ${Math.floor(tHeight)}px` 
                });
                $(`.tile.t${tNo}`).attr("value", "");   
                tWidth -= (width/this.col);
                tNo++;
            }
            tHeight -= (height/this.row);
        }
        if(!lastTile){
            $(`.tile.t${this.row*this.col-1}`).css({"background-image":"none"});
            $(`.tile.t${this.row*this.col-1}`).attr("value", "gap");
        }
    }
    //swap css properties of two tiles, the neighbour is always empty
    swapTile(last, curr){
        let gap = $(`#${last}`).css("background-position");
        let clicked= $(`#${curr}`).css("background-position");   
        let classTemp = $(`#${curr}`).attr("class");
        $(`#${curr}`).css({"background-position":gap, "background-image":"none"});
        $(`#${curr}`).attr("value", "gap");        
        $(`#${curr}`).attr("class",  $(`#${last}`).attr("class"));     
        $(`#${last}`).css({"background-position":clicked, "background-image":`url(${this.img.src})`});        
        $(`#${last}`).attr("value", "");        
        $(`#${last}`).attr("class", classTemp);
        
    }

    //return absolute distance
    dist(x1, y1, x2 , y2){
        return Math.abs(x1 -x2) + Math.abs(y1 -y2);
    }
}