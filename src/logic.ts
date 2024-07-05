import {PixelRatio, Dimensions} from 'react-native';
import Canvas, {CanvasRenderingContext2D} from 'react-native-canvas';

const filterData = (audioBuffer: number[], s: number): number[] => {
  const rawData = audioBuffer; // We only need to work with one channel of data
  const samples = s; // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision

  const filteredData = [];

  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; // the location of the first sample in the block
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
    }
    filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
  }

  return filteredData;
};

const normalizeData = (filteredData: number[]): number[] => {
  const multiplier = Math.pow(Math.max(...filteredData), -1);
  const r = filteredData.map(n => n * multiplier);

  return r;
};
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const draw = (canvas: Canvas | null, normalizedData: number[]) => {
  if (!canvas) return;
  const dpr = PixelRatio.get();
  const sW = screenWidth / 4;
  const sH = screenHeight / 20;
  const padding = 20;
  canvas.width = sW * dpr;
  canvas.height = (sH + padding * 2) * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.translate(0, sH / 2 + padding); // set Y = 0 to be in the middle of the canvas
  // draw the line segments
  const w = sW / normalizedData.length;
  for (let i = 0; i < normalizedData.length; i++) {
    const x = w * i;
    let h = normalizedData[i] * sH - padding;

    if (h < 0) {
      h = 0;
    } else if (h > sH / 2) {
      h = h - sH / 2;
    }
    drawLineSegment(ctx, x, h, w, (i + 1) % 2 === 0);
  }
};

const drawLineSegment = (
  ctx: CanvasRenderingContext2D,
  x: number,
  height: number,
  width: number,
  isEven: boolean,
) => {
  ctx.lineWidth = 1; // how thick the line is
  ctx.strokeStyle = '#fff'; // what color our line is
  ctx.beginPath();
  height = isEven ? height : -height;
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
  ctx.lineTo(x + width, 0);
  ctx.stroke();
};

const data = [
  0.6798487324567891, 0.22390178349827563, 0.5467892345678901,
  0.3123456789012345, 0.8912345678901234, 0.4325678901234568,
  0.6543210987654321, 0.7890123456789012, 0.4567890123456789,
  0.6789012345678901, 0.23456789012345678, 0.567890123456789,
  0.12345678901234567, 0.7890123456789012, 0.8901234567890123,
  0.3456789012345678, 0.4567890123456789, 0.567890123456789, 0.6789012345678901,
  0.7890123456789012, 0.23456789012345678, 0.567890123456789,
  0.6789012345678901, 0.7890123456789012, 0.8901234567890123,
  0.12345678901234567, 0.4567890123456789, 0.567890123456789,
  0.6789012345678901, 0.7890123456789012,
];

export {draw, filterData, normalizeData, drawLineSegment, data};
