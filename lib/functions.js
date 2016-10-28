const getColors = (req, res, next) => {
  const tones = res.data.document_tone.tone_categories[0].tones;
  const allColors = [
    [255, 0, 0],
    [128, 0, 128],
    [255, 255, 0],
    [0, 255, 0],
    [0, 0, 255]
  ];

  let rTot = 0;
  let gTot = 0;
  let bTot = 0;
  for (let i = 0; i < tones.length; i++) {
    rTot += (tones[i].score * allColors[i][0]);
    gTot += (tones[i].score * allColors[i][1]);
    bTot += (tones[i].score * allColors[i][2]);
  }
  res.colors = {
    red: Math.floor(rTot),
    green: Math.floor(gTot),
    blue: Math.floor(bTot),
  }
  console.log(res.colors);
  next();
}

module.exports = {
  getColors,
}
