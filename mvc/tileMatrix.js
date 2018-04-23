/**
 * @sakaijun
 * define a set of tiles (row, column)
 * 
 */
import {Tile} from "./tile.js";

export class TileMatrix {

    

    //init matrix of tile instances, store properties
    createTileMat(row, col) {

        var tiles = [];
        var val = 0;

        for (var i = 0; i < row; i++) {
            tiles[i] = [];
            for (var j = 0; j < col; j++) {
                tiles[i][j] = new Tile();
                tiles[i][j].val = val + 1;
                tiles[i][j].x = i;
                tiles[i][j].y = j;
                val++;
            }
        }
        return tiles;
    }

    
}