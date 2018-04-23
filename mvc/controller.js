import {Shuffle} from "./shuffle.js";
import { TileMatrix } from "./tileMatrix.js";


/**
 * @author sakaijun
 * 
 * + every image will be displayed by 640xH
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
    
    btnListener(){

        $(".MxN").on("click", () =>{     
            $(".tile").remove();        
            $("#info").html(""); 
            this.sliceImg($("#row").val(), $("#col").val(), false);
        });

        $("#undo").on("click", () =>{     
            $(".tile").remove();
            $("#info").html("");
            this.sliceImg($("#row").val(), $("#col").val(), false);
        });

        $("#rnd").on("click", () =>{
            $("#info").html("");
            $(".tile").remove();            
            this.sliceImg($("#row").val(), $("#col").val(), true);
        });

        $("#readFile").on('change', () => {             
            this.previewFile((res)=>{ 
                $("#fullIMG").remove();
                var e = $("<img id=\"fullIMG\" alt=\"\" />");
                $('.puzzle').append(e);                
                $(".tile").remove();    
                $('#fullIMG').attr("src", res);
                setTimeout(() => {            
                    this.sliceImg($("#row").val(), $("#col").val(), false);
                }, 1000);              
            });
        });   
    }  
    //assign listener to every tile, swapping is only allowed when the next one is a gap
    tileListener(img){
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
                        this.swapTile(x[i].id, curr, img);
                        this.evaluate(x, img);                                               
                    }
                }
            }    
        });
    }
    //check if all tiles placed right
    evaluate(tile, img){
        let tileLen = $("#row").val()*$("#col").val();
        let placedRight = 0;
        for(let j=0; j < tile.length; j++) {
            if(`tile t${j}` === tile[j].className){
                placedRight++; 
                if(tileLen -1 == placedRight){
                    $("#info").html("Solved!");
                    $(`.tile.t${tileLen-1}`).css({"background-image":`url(${img.src})`}); 
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

    sliceImg(row, col, rnd){        
        let tm = new TileMatrix();
        let arr = tm.createTileMat(row, col);
        $('#fullIMG').css({ "display": "inline" });                          
        let shuffle = new Shuffle();
        let shuffled = shuffle.randomOrder(arr, rnd);      
        var img = document.getElementById('fullIMG');       
        $("#dimInfo").html(`Format: ${row}x${col}`); 
        var width = 640;        
        var ratio = img.clientWidth/width;
        var height = img.clientHeight/ratio;
        
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

        this.buildTile(width, height, row, col, shuffled, img)      
        this.tileListener(img);
    }

    //build Tiles of an image, the last one is always marked as "gap"
    buildTile(width, height, row, col, shuffled, img){
        let k = 0;
        var tNo =0;
        var tWidth =0;
        var tHeight = 0;
        for (let i = 0; i < row; i++){
            for (let j = 0; j < col; j++){
                $(".puzzle").append(`<div class="tile t${shuffled[k] - 1}" id="${i}${j}"></div>`);         
                k++;
            }
        }

        $('.tile').css({
            "width": `${Math.round(width/col)-2}px`,
            "height": `${Math.round(height/row)-2}px`,
            "float": "left",            
            "border": "1px solid black",
            "background-image":`url(${img.src})`,
            "background-size": "640px auto"
        });        
       
        for (var i =0; i<row; i++){
            tWidth =0;
            for (var j =0; j<col; j++){
                $(`.tile.t${tNo}`).css({ 
                    "background-position": `${Math.round(tWidth)}px ${Math.round(tHeight)}px` 
                });
                $(`.tile.t${tNo}`).attr("value", "");   
                tWidth -= (width/col);
                tNo++;
            }
            tHeight -= (height/row);
        }
        $(`.tile.t${row*col-1}`).css({"background-image":"none"});
        $(`.tile.t${row*col-1}`).attr("value", "gap");
    }
    //swap css properties of two tiles, the neighbour is always empty
    swapTile(last, curr, img){
        let gap = $(`#${last}`).css("background-position");
        let clicked= $(`#${curr}`).css("background-position");   
        let classTemp = $(`#${curr}`).attr("class");
        $(`#${curr}`).css({"background-position":gap, "background-image":"none"});
        $(`#${curr}`).attr("value", "gap");        
        $(`#${curr}`).attr("class",  $(`#${last}`).attr("class"));     
        $(`#${last}`).css({"background-position":clicked, "background-image":`url(${img.src})`});        
        $(`#${last}`).attr("value", "");        
        $(`#${last}`).attr("class", classTemp);
        
    }

    //return absolute distance
    dist(x1, y1, x2 , y2){
        return Math.abs(x1 -x2) + Math.abs(y1 -y2);
    }
}