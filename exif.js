import exif from "exif-js";


export var EXIF_TRANSFORMS = {
  1: {rotate: 0, flip: false},
  2: {rotate: 0, flip: true},
  3: {rotate: Math.PI, flip: false},
  4: {rotate: Math.PI, flip: true},
  5: {rotate: Math.PI * 1.5, flip: true},
  6: {rotate: Math.PI * 0.5, flip: false},
  7: {rotate: Math.PI * 0.5, flip: true},
  8: {rotate: Math.PI * 1.5, flip: false},
};


export default async function resolveExif(image, maxWidth=800) {

  if (typeof image == "string") {
    image = await getImageFromUrl(image);
  }

  let url = await new Promise(function(resolve, reject) {
    exif.getData(image, function() {
      let orientation = exif.getTag(this, "Orientation");
      if (orientation) {
        let canvas = getCanvasForImage(image, maxWidth);
        let w = canvas.width;
        let h = canvas.height;

        if (orientation > 4) {
          let temp = canvas.width;
          canvas.width = canvas.height;
          canvas.height = temp;
        }

        let ctx = canvas.getContext("2d");

        exifTransformCanvas(ctx, orientation);
        ctx.drawImage(image, 0, 0, image.width, image.height,
                            -w / 2, -h / 2, w, h);
        resolve(canvas.toDataURL());
      } else {
        resolve(image.src);
      }
    });
  });

  return url;
}


export function getImageFromUrl(url) {
  return new Promise(function(resolve, reject) {
    let image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function() { resolve(image); };
    image.onerror = function(e) { reject(e); };
    image.src = url;
  });
}


export function getCanvasForImage(image, maxWidth) {
  let canvas = document.createElement("canvas");
  let w = image.width;
  let h = image.height;

  if (maxWidth && w > maxWidth) {
    let ratio = w / h;
    w = maxWidth;
    h = w / ratio;
  }
  canvas.width = w;
  canvas.height = h;
  return canvas;
}


export function exifTransformCanvas(ctx, orientation) {
  let transform = EXIF_TRANSFORMS[orientation];
  if (transform) {
    return transformCanvas(ctx, transform.rotate, transform.flip);
  }
  return ctx;
}

export function transformCanvas(ctx, degrees=0, flip=false) {
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.rotate(degrees);
  if (flip) {
    ctx.scale(-1, 1);
  }
  return ctx;
}