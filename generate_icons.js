const Jimp = require('jimp');

async function createIcons() {
  try {
    const image1 = await Jimp.read('VIGI.png');
    const bg192 = new Jimp(192, 192, 0x00000000); // transparent
    image1.scaleToFit(192, 192);
    bg192.composite(image1, (192 - image1.bitmap.width) / 2, (192 - image1.bitmap.height) / 2);
    await bg192.writeAsync('icon-192.png');

    const image2 = await Jimp.read('VIGI.png');
    const bg512 = new Jimp(512, 512, 0x00000000); // transparent
    image2.scaleToFit(512, 512);
    bg512.composite(image2, (512 - image2.bitmap.width) / 2, (512 - image2.bitmap.height) / 2);
    await bg512.writeAsync('icon-512.png');

    console.log('Icons generated successfully.');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

createIcons();
