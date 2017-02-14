import {assert} from "chai";
import resolveExif, {getImageFromUrl} from "./exif";
import exif from "exif-js";


function verifyImage() {

}

describe("resolveExif", function() {
  it("can load an html image", function(done) {
    let image = new Image();
    image.onload = function() {
      resolveExif(image).then(function(result) {
        return getImageFromUrl(result);
      }).then(function(image) {
        assert.equal(image.width, 600);
        assert.equal(image.height, 450);
        done();
      }).catch(function() {
        assert.fail("Failed to process image");
      });
    };
    image.onerror = function() {
      assert.fail("Failed to load image");
    };
    image.src = "./test_images/Landscape_2.jpg";
  });


  it("can load a url", function() {
    return resolveExif("./test_images/Landscape_6.jpg").then(function(result) {
      return getImageFromUrl(result);
    }).then(function(image) {
      assert.equal(image.width, 600);
      assert.equal(image.height, 450);
    });
  });


  it("can thumbnail", function() {
    return resolveExif("./test_images/Landscape_2.jpg", 200).then(function(result) {
      return getImageFromUrl(result);
    }).then(function(image) {
      assert.equal(image.width, 200);
      assert.equal(image.height, 150);
    });
  });
});