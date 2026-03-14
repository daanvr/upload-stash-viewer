// Upload Stash Viewer — Mock Data for Demo Mode

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export const MOCK_STASH_FILES = [
  {
    filekey: 'demo1.abc123.190001.jpg',
    size: 4825600,
    type: 'image/jpeg',
  },
  {
    filekey: 'demo2.def456.190002.jpg',
    size: 2150400,
    type: 'image/jpeg',
  },
  {
    filekey: 'demo3.ghi789.190003.png',
    size: 8912000,
    type: 'image/png',
  },
  {
    filekey: 'demo4.jkl012.190004.tif',
    size: 45200000,
    type: 'image/tiff',
  },
  {
    filekey: 'demo5.mno345.190005.svg',
    size: 128000,
    type: 'image/svg+xml',
  },
  {
    filekey: 'demo6.pqr678.190006.jpg',
    size: 1520000,
    type: 'image/jpeg',
  },
];

export const MOCK_FILE_DETAILS = {
  'demo1.abc123.190001.jpg': {
    filekey: 'demo1.abc123.190001.jpg',
    timestamp: hoursAgo(3),
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/800px-Camponotus_flavomarginatus_ant.jpg',
    thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/300px-Camponotus_flavomarginatus_ant.jpg',
    descriptionurl: '',
    mime: 'image/jpeg',
    size: 4825600,
    width: 4032,
    height: 3024,
    bitdepth: 8,
    sha1: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    metadata: [
      { name: 'Make', value: 'Apple' },
      { name: 'Model', value: 'iPhone 15 Pro' },
      { name: 'DateTimeOriginal', value: '2026:03:13 14:30:22' },
      { name: 'GPSLatitude', value: '52.3676' },
      { name: 'GPSLongitude', value: '4.9041' },
      { name: 'FocalLength', value: '6.86 mm' },
      { name: 'ExposureTime', value: '1/125' },
      { name: 'FNumber', value: 'f/1.78' },
      { name: 'ISOSpeedRatings', value: '64' },
    ],
    commonmetadata: [
      { name: 'Artist', value: 'Daan van Ramshorst' },
    ],
    suggestedFilename: 'IMG_4521.jpg',
  },
  'demo2.def456.190002.jpg': {
    filekey: 'demo2.def456.190002.jpg',
    timestamp: hoursAgo(18),
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/800px-PNG_transparency_demonstration_1.png',
    thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/300px-PNG_transparency_demonstration_1.png',
    descriptionurl: '',
    mime: 'image/jpeg',
    size: 2150400,
    width: 3264,
    height: 2448,
    bitdepth: 8,
    sha1: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    metadata: [
      { name: 'Make', value: 'Canon' },
      { name: 'Model', value: 'EOS R6' },
      { name: 'DateTimeOriginal', value: '2026:03:12 10:15:00' },
      { name: 'FocalLength', value: '50 mm' },
      { name: 'ExposureTime', value: '1/250' },
      { name: 'FNumber', value: 'f/2.8' },
      { name: 'ISOSpeedRatings', value: '200' },
    ],
    commonmetadata: [],
    suggestedFilename: 'Museum_artwork_front.jpg',
  },
  'demo3.ghi789.190003.png': {
    filekey: 'demo3.ghi789.190003.png',
    timestamp: hoursAgo(36),
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
    thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/300px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
    descriptionurl: '',
    mime: 'image/png',
    size: 8912000,
    width: 5120,
    height: 3840,
    bitdepth: 16,
    sha1: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    metadata: [
      { name: 'DateTimeOriginal', value: '2026:03:11 16:45:33' },
      { name: 'GPSLatitude', value: '51.0486' },
      { name: 'GPSLongitude', value: '3.7318' },
    ],
    commonmetadata: [],
    suggestedFilename: 'DSC00142.png',
  },
  'demo4.jkl012.190004.tif': {
    filekey: 'demo4.jkl012.190004.tif',
    timestamp: hoursAgo(44),
    url: '',
    thumburl: '',
    descriptionurl: '',
    mime: 'image/tiff',
    size: 45200000,
    width: 6000,
    height: 4000,
    bitdepth: 16,
    sha1: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
    metadata: [
      { name: 'Make', value: 'Hasselblad' },
      { name: 'Model', value: 'X2D 100C' },
      { name: 'DateTimeOriginal', value: '2026:03:10 09:00:00' },
    ],
    commonmetadata: [
      { name: 'Artist', value: 'Museum digitization team' },
      { name: 'Copyright', value: 'Public Domain' },
    ],
    suggestedFilename: 'Scan_high_res_painting.tif',
  },
  'demo5.mno345.190005.svg': {
    filekey: 'demo5.mno345.190005.svg',
    timestamp: hoursAgo(1),
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/SVG_Logo.svg/800px-SVG_Logo.svg.png',
    thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/SVG_Logo.svg/300px-SVG_Logo.svg.png',
    descriptionurl: '',
    mime: 'image/svg+xml',
    size: 128000,
    width: 1200,
    height: 800,
    bitdepth: 0,
    sha1: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    metadata: [],
    commonmetadata: [
      { name: 'Artist', value: 'Daan van Ramshorst' },
    ],
    suggestedFilename: 'Diagram_workflow.svg',
  },
  'demo6.pqr678.190006.jpg': {
    filekey: 'demo6.pqr678.190006.jpg',
    timestamp: hoursAgo(47),
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png',
    thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/300px-Image_created_with_a_mobile_phone.png',
    descriptionurl: '',
    mime: 'image/jpeg',
    size: 1520000,
    width: 2048,
    height: 1536,
    bitdepth: 8,
    sha1: 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1',
    metadata: [
      { name: 'Make', value: 'Google' },
      { name: 'Model', value: 'Pixel 8' },
      { name: 'DateTimeOriginal', value: '2026:03:12 19:22:10' },
      { name: 'GPSLatitude', value: '48.8566' },
      { name: 'GPSLongitude', value: '2.3522' },
    ],
    commonmetadata: [],
    suggestedFilename: 'IMG_20260312_192210.jpg',
  },
};

export async function getMockStashList() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_STASH_FILES.map((file, i) => {
    const detail = MOCK_FILE_DETAILS[file.filekey];
    return {
      ...file,
      timestamp: detail?.timestamp,
      thumburl: detail?.thumburl,
    };
  });
}

export async function getMockFileInfo(filekey) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const detail = MOCK_FILE_DETAILS[filekey];
  if (!detail) throw new Error(`Unknown filekey: ${filekey}`);
  return detail;
}

export function getMockUserProfile() {
  return {
    sub: '0',
    username: 'DemoUser',
    editcount: 42,
    confirmed_email: true,
  };
}
