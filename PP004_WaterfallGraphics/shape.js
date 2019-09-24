class Shape {
  constructor(inWidth) {   
    this.wCount = inWidth;
  }

  genShape(inShape, inParam) {    
    let hCount = 0;
    let wCount = 0;
    let shapeMat = [];
    let currRow = [];
    let initState = [];

    switch (inShape) {
      case 'sheet':
        // set params
        if (inParam) {
          hCount = inParam;
        } else {
          hCount = 30;
        }

        // create matrix
        for (let i = 0; i < hCount; i++) {
          for (let j = 0; j < this.wCount; j++) {
            currRow[j] = 1;
          }
          shapeMat.push(currRow);
        }
        break;
      case 'checkered':
        // set params
        if (inParam) {
          hCount = abs(inParam);
        } else {
          hCount = 5;
        }
        wCount = abs(hCount);
        if (inParam > 0) {
          initState = 1;
        } else {
          initState = 0;
        }

        // create blank matrix
        for (let i = 0; i < hCount; i++) {
          for (let j = 0; j < this.wCount; j++) {
            // flip if interval is reached
            if (j % wCount == 0) {
              if (initState == 1) {
                initState = 0;
              } else {
                initState = 1;
              }
            }
            currRow[j] = initState;
          }
          shapeMat.push(currRow);
        }        
        break;
      case 'sine':
        // set params
        if (inParam) {
          hCount = abs(inParam);
        } else {
          hCount = 5;
        }

        if (inParam > 0) {
          initState = 1;
        } else {
          initState = 0;
        }

        // create matrix
        for (let y = 0; y < hCount; y++) {
          shapeMat[y] = [];
          for (let x = 0; x < this.wCount; x++) {
            shapeMat[y][x] = 0;
          }
        }

        // populate matrix
        const span = TWO_PI * 4;
        const incX = span / this.wCount;
        const incY = -2 / hCount;
        let gridX = 0;
        let gridY = 1;
        for (let y = 0; y < hCount; y++) {
          for (let x = 0; x < this.wCount; x++) {
            const evalY = -cos(gridX);

            if (initState) {
              if (gridY <= evalY) {
                shapeMat[y][x] = 1;
              }
            } else {
              if (gridY >= evalY) {
                shapeMat[y][x] = 1;
              }
            }

            gridX += incX;
          }
          gridY += incY;
        }
        break;
      case 'zigzag':
        // set params
        if (inParam) {
          hCount = abs(inParam);
        } else {
          hCount = 5;
        }

        if (inParam > 0) {
          initState = 1;
        } else {
          initState = -1;
        }

        // create matrix
        for (let y = 0; y < hCount; y++) {
          shapeMat[y] = [];
          for (let x = 0; x < this.wCount; x++) {
            shapeMat[y][x] = 0;
          }
        }

        // populate matrix
        const gap = hCount;
        let pushCtr = 0;
        const pushSkip = initState * 1;
        let currPoint = 1;
        for (let y = 0; y < hCount; y++) {
          for (let x = 0; x < this.wCount; x++) {
            // flip if interval is reached
            if ((x + pushCtr) % gap == 0) {
              if (currPoint == 1) {
                currPoint = 0;
              } else {
                currPoint = 1;
              }
            }
            shapeMat[y][x] = currPoint;
          }
          pushCtr += pushSkip;
        }

        // remove first line
        shapeMat.splice(0, 1);
        break;
      default:
        console.log('error: unknown shape');
        break;
    }
    return shapeMat;
  }
}