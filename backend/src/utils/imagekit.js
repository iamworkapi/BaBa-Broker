import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_l1Wrf/BQMiPW5Fcl+RbziSL1gXs=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_7sJixGCTCP94tW5rovjwPiqGCfU=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/orrishbaba',
});

export async function uploadBase64ToImageKit(base64String, fileName) {
  if (!base64String || typeof base64String !== 'string') return null;
  const cleaned = base64String.replace(/^data:image\/\w+;base64,/, '');
  try {
    const result = await imagekit.upload({
      file: cleaned,
      fileName: fileName || `listing-${Date.now()}`,
      folder: '/BABA-Broker',
    });
    return result.url;
  } catch (err) {
    console.error('ImageKit upload error:', err.message);
    return null;
  }
}

export async function uploadUrlToImageKit(imageUrl, fileName) {
  if (!imageUrl || typeof imageUrl !== 'string') return null;
  if (imageUrl.startsWith('http')) {
    try {
      const result = await imagekit.upload({
        file: imageUrl,
        fileName: fileName || `listing-${Date.now()}`,
        folder: '/BABA-Broker',
      });
      return result.url;
    } catch (err) {
      console.error('ImageKit URL upload error:', err.message);
      return null;
    }
  }
  return null;
}

export default imagekit;
