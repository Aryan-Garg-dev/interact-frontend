import tinycolor from 'tinycolor2';

// export function generateRandomProfilePicture(width: number, height: number): Promise<File> {
//   return new Promise((resolve, reject) => {
//     // Create a temporary canvas
//     const tempCanvas = document.createElement('canvas');
//     tempCanvas.width = width;
//     tempCanvas.height = height;

//     const ctx = tempCanvas.getContext('2d');

//     if (ctx) {
//       // Generate random geometric patterns with circles and squares
//       for (let i = 0; i < 30; i++) {
//         const x = Math.random() * tempCanvas.width;
//         const y = Math.random() * tempCanvas.height;
//         const shape = Math.random() > 0.5 ? 'circle' : 'square';

//         if (shape === 'circle') {
//           const radius = Math.random() * 40 + 20; // Random radius between 20 and 60
//           const color = getRandomHexColor();

//           ctx.beginPath();
//           ctx.arc(x, y, radius, 0, Math.PI * 2);
//           ctx.fillStyle = color;
//           ctx.fill();
//         } else {
//           const size = Math.random() * 60 + 30; // Random size between 30 and 90
//           const color = getRandomHexColor();

//           ctx.beginPath();
//           ctx.rect(x - size / 2, y - size / 2, size, size);
//           ctx.fillStyle = color;
//           ctx.fill();
//         }
//       }

//       // Generate random lines and splatters
//       for (let i = 0; i < 25; i++) {
//         const x1 = Math.random() * tempCanvas.width;
//         const y1 = Math.random() * tempCanvas.height;

//         let x2, y2;

//         // Ensure the endpoints are a little distance apart
//         do {
//           x2 = Math.random() * tempCanvas.width;
//           y2 = Math.random() * tempCanvas.height;
//         } while (Math.hypot(x2 - x1, y2 - y1) < 100); // Minimum distance of 50

//         const thickness = Math.random() * 5 + 1; // Random thickness between 1 and 6
//         const color = getRandomHexColor();

//         ctx.beginPath();
//         ctx.moveTo(x1, y1);
//         ctx.lineTo(x2, y2);
//         ctx.strokeStyle = color;
//         ctx.lineWidth = thickness;
//         ctx.stroke();
//       }

//       // Convert canvas to data URL
//       const dataURL = tempCanvas.toDataURL('image/png');

//       // Convert data URL to Blob
//       fetch(dataURL)
//         .then(res => res.blob())
//         .then(blob => {
//           // Create a unique filename (e.g., profile_image_2023-09-28.png)
//           const fileName = `profile_image_${new Date().toISOString().split('T')[0]}.png`;

//           // Create a File from the Blob
//           const imageFile = new File([blob], fileName, { type: 'image/png' });

//           // Resolve with the created image file
//           resolve(imageFile);
//         })
//         .catch(error => reject(error));
//     } else {
//       reject(new Error('Canvas context not supported.'));
//     }
//   });
// }

// function generateRandomProfilePicture(width: number, height: number): Promise<File> {
//   return new Promise((resolve, reject) => {
//     // Create a temporary canvas
//     const tempCanvas = document.createElement('canvas');
//     tempCanvas.width = width;
//     tempCanvas.height = height;

//     const ctx = tempCanvas.getContext('2d');

//     if (ctx) {
//       // Solid background color
//       ctx.fillStyle = getRandomHexColor();
//       ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

//       // Generate random lines with varying width
//       const numLines = 40;
//       for (let i = 0; i < numLines; i++) {
//         const x1 = Math.random() * tempCanvas.width;
//         const y1 = Math.random() * tempCanvas.height;
//         const x2 = Math.random() * tempCanvas.width;
//         const y2 = Math.random() * tempCanvas.height;
//         const lineWidth = Math.random() * 5 + 1; // Varying width between 1 and 6
//         const lineColor = getRandomHexColor();

//         ctx.beginPath();
//         ctx.moveTo(x1, y1);
//         ctx.lineTo(x2, y2);
//         ctx.strokeStyle = lineColor;
//         ctx.lineWidth = lineWidth;
//         ctx.stroke();
//       }

//       // Generate random circles
//       const numCircles = 75;
//       for (let i = 0; i < numCircles; i++) {
//         const circleX = Math.random() * tempCanvas.width;
//         const circleY = Math.random() * tempCanvas.height;
//         const circleRadius = Math.random() * 10 + 5; // Varying radius between 5 and 20
//         const circleColor = getRandomHexColor();

//         ctx.beginPath();
//         ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
//         ctx.fillStyle = circleColor;
//         ctx.fill();
//       }

//       // Generate random face-like features
//       const faceRadius = Math.min(tempCanvas.width, tempCanvas.height) / 3;
//       const eyeRadius = 50;
//       const mouthWidth = 100;
//       const eyebrowLength = 80;
//       const eyebrowArcHeight = 25;
//       const noseSize = 75;
//       const accessoryRadius = 0;

//       const centerX = tempCanvas.width / 2;
//       const centerY = tempCanvas.height / 2;

//       // Draw face
//       ctx.beginPath();
//       ctx.arc(centerX, centerY, faceRadius, 0, Math.PI * 2);
//       ctx.fillStyle = getRandomHexColor();
//       ctx.fill();

//       // Draw eyes
//       const eyeOffsetX = faceRadius / 2;
//       const eyeOffsetY = -faceRadius / 4;

//       ctx.beginPath();
//       ctx.arc(centerX - eyeOffsetX, centerY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
//       ctx.fillStyle = getRandomHexColor();
//       ctx.fill();

//       ctx.beginPath();
//       ctx.arc(centerX + eyeOffsetX, centerY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
//       ctx.fillStyle = getRandomHexColor();
//       ctx.fill();

//       // Draw eyebrows
//       const eyebrowOffsetY = centerY - faceRadius / 1.5;

//       // Left eyebrow
//       ctx.beginPath();
//       ctx.moveTo(centerX - eyeOffsetX - eyebrowLength / 2, eyebrowOffsetY);
//       ctx.quadraticCurveTo(
//         centerX - eyeOffsetX,
//         eyebrowOffsetY - eyebrowArcHeight,
//         centerX - eyeOffsetX + eyebrowLength / 2,
//         eyebrowOffsetY
//       );
//       ctx.strokeStyle = getRandomHexColor();
//       ctx.lineWidth = 3;
//       ctx.stroke();

//       // Right eyebrow
//       ctx.beginPath();
//       ctx.moveTo(centerX + eyeOffsetX - eyebrowLength / 2, eyebrowOffsetY);
//       ctx.quadraticCurveTo(
//         centerX + eyeOffsetX,
//         eyebrowOffsetY - eyebrowArcHeight,
//         centerX + eyeOffsetX + eyebrowLength / 2,
//         eyebrowOffsetY
//       );
//       ctx.strokeStyle = getRandomHexColor();
//       ctx.lineWidth = 3;
//       ctx.stroke();

//       // Draw nose (triangle)
//       ctx.beginPath();
//       ctx.moveTo(centerX - noseSize / 2, centerY);
//       ctx.lineTo(centerX + noseSize / 2, centerY);
//       ctx.lineTo(centerX, centerY - noseSize);
//       ctx.closePath();
//       ctx.fillStyle = getRandomHexColor();
//       ctx.fill();

//       // Draw mouth
//       ctx.beginPath();
//       ctx.arc(centerX, centerY + faceRadius / 4, mouthWidth, 0, Math.PI);
//       ctx.strokeStyle = getRandomHexColor();
//       ctx.lineWidth = 5;
//       ctx.stroke();

//       // Draw accessories (e.g., earrings)
//       const accessoryOffsetY = centerY - faceRadius / 1.5;

//       ctx.beginPath();
//       ctx.arc(centerX - faceRadius / 2, accessoryOffsetY, accessoryRadius, 0, Math.PI * 2);
//       ctx.fillStyle = getRandomHexColor();
//       ctx.fill();

//       ctx.beginPath();
//       ctx.arc(centerX + faceRadius / 2, accessoryOffsetY, accessoryRadius, 0, Math.PI * 2);
//       ctx.fillStyle = getRandomHexColor();
//       ctx.fill();

//       // Convert canvas to data URL
//       const dataURL = tempCanvas.toDataURL('image/png');

//       // Convert data URL to Blob
//       fetch(dataURL)
//         .then(res => res.blob())
//         .then(blob => {
//           // Create a unique filename (e.g., avatar_2023-09-28.png)
//           const fileName = `avatar_${new Date().toISOString().split('T')[0]}.png`;

//           // Create a File from the Blob
//           const imageFile = new File([blob], fileName, { type: 'image/png' });

//           // Resolve with the created image file
//           resolve(imageFile);
//         })
//         .catch(error => reject(error));
//     } else {
//       reject(new Error('Canvas context not supported.'));
//     }
//   });
// }

interface Square {
  x: number;
  y: number;
  size: number;
}

function generateRandomProfilePicture(width: number, height: number): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;

      const ctx = tempCanvas.getContext('2d');

      if (ctx) {
        // Solid white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Pick a random color
        const baseColor = getRandomHexColor();

        // Generate random pattern of squares
        const numSquares = 25; // Reduced number of squares
        const minSquareSize = 120;
        const maxSquareSize = 250;
        const squares: Square[] = [];

        for (let i = 0; i < numSquares; i++) {
          let squareSize = 0,
            squareX = 0,
            squareY = 0;

          var overlapChecker = true;
          // Try up to 100 times to find a non-overlapping position
          for (let attempt = 0; attempt < 150; attempt++) {
            overlapChecker = true;
            squareSize = Math.random() * (maxSquareSize - minSquareSize) + minSquareSize;
            squareX = Math.random() * (tempCanvas.width - squareSize);
            squareY = Math.random() * (tempCanvas.height - squareSize);

            // Check for overlap with existing squares
            const overlaps = squares.some(
              existingSquare =>
                squareX < existingSquare.x + existingSquare.size &&
                squareX + squareSize > existingSquare.x &&
                squareY < existingSquare.y + existingSquare.size &&
                squareY + squareSize > existingSquare.y
            );

            if (!overlaps) {
              // If no overlap, break the loop
              overlapChecker = false;
              break;
            }
          }

          if (!overlapChecker) {
            // Save the position and size of the current square
            squares.push({ x: squareX, y: squareY, size: squareSize });

            // Draw the square
            ctx.fillStyle = generateShadeOfColor(baseColor);
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }
        }

        // Convert canvas to data URL
        const dataURL = tempCanvas.toDataURL('image/jpeg');

        // Convert data URL to Blob
        fetch(dataURL)
          .then(res => res.blob())
          .then(blob => {
            // Create a unique filename (e.g., pattern_2023-09-28.png)
            const fileName = `pattern_${Math.random() * 1000}-${new Date().toISOString().split('T')[0]}.jpeg`;

            // Create a File from the Blob
            const imageFile = new File([blob], fileName, { type: 'image/jpeg' });

            // Resolve with the created image file
            resolve(imageFile);
          })
          .catch(error => reject(error));
      } else {
        reject(new Error('Canvas context not supported.'));
      }
    } catch (err) {
      reject(new Error('Canvas context not supported.'));
    }
  });
}

function getRandomHexColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function generateShadeOfColor(baseColor: string): string {
  // You can adjust the factor to control the darkness of the shade
  const shadeFactor = Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0
  const color = tinycolor(baseColor);
  const shadedColor =
    Math.random() > 0.5 ? color.lighten(shadeFactor * 20).toString() : color.darken(shadeFactor * 10).toString();
  return shadedColor;
}

export default generateRandomProfilePicture;
