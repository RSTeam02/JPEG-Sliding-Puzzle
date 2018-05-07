# Rectangular Sliding-Puzzle

Extend previous project (Image-Slicer) into a Sliding Puzzle game
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
