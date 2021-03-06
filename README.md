# Rectangular Sliding-Puzzle

Extend previous project (Image-Slicer) into a Sliding Puzzle game
+ 21.08: adapt/adjust size of the whole puzzle, dependent on browser window size/screen resolution (responsive resizing)
+ 20.08: use unicode symbols, pictograms as puzzle layout (reused from previous project) choose one from "unicode-gallery"=> convert into a canvas image to slice in pieces
+ 20.08: center whole canvas
+ 24.06: additional preview images added random selection, when restarted (F5)
+ 10.05: (re)load tile listeners, during/after animation => better solution: lock tiles when animation starts, unlock tiles when animation ends  
+ 10.05: fixed animation lags at some tile positions by replacing "0px" with "" (direction resets) 
+ 10.05: added speed modes fast and slow  
+ 08.05: prevent long if, else clauses by converting direction strings (top, bottom, left, right) into json, pass them directly  
+ 07.05: added css animations, related to shift direction 
+ 27.04: removed settimeout for reading height, width from img tag, size is now retrieved from Image() 
+ 27.04: remove image tag for preview => create grid on the fly
+ 27.04: instead of removing tiles, overwrite whole puzzle class with (".puzzle").html(tileSet), when reloaded
+ 26.04: support for common image types (JPEG, TIFF, PNG, GIF)
+ 26.04: tiles only moveable if shuffled
+ 26.04: return shuffled without split, join 
+ diagram added
+ 24.04: recalculate size of image raster dependent on browser window size
+ divide image into rows and columns (rectangular or square number of tiles)
+ shuffle tiles, reuse of shuffle.js from: https://github.com/RSTeam02/nxn_Sliding_Puzzle 
+ if all tiles are placed right, return "solved" (compare order of elements)

Test:
https://rsteam02.github.io/JPEG-Sliding-Puzzle/
