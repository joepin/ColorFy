const router = require('express').Router();
const watsonService = require('../services/watson');
const recents = require('../models/recents');

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

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/show', watsonService.analyzeText, getColors, recents.addToRecents, (req, res) => {
  // res.json(res.data);
  res.render('test', {
    colors: JSON.stringify(res.colors),
    text: req.body.main,
    response: JSON.stringify(res.data),
    red: res.colors.red,
    green: res.colors.green,
    blue: res.colors.blue,
    tones0: res.data.document_tone.tone_categories[0].tones,
    tones1: res.data.document_tone.tone_categories[1].tones,
    tones2: res.data.document_tone.tone_categories[2].tones,
  });
});

// router.get('/test', (req, res) => {

//   const anger = [255, 0, 0];
//   const disgust = [128, 0, 128];
//   const fear = [255, 255, 0];
//   const joy = [0, 255, 0];
//   const sadness = [0, 0, 255];
//   // const tones = [
//   //   {
//   //     score: 0.123256,
//   //     tone_id: "anger",
//   //     tone_name: "Anger"
//   //   },
//   //   {
//   //     score: 0.009075,
//   //     tone_id: "disgust",
//   //     tone_name: "Disgust"
//   //   },
//   //   {
//   //     score: 0.036772,
//   //     tone_id: "fear",
//   //     tone_name: "Fear"
//   //   },
//   //   {
//   //     score: 0.824371,
//   //     tone_id: "joy",
//   //     tone_name: "Joy"
//   //   },
//   //   {
//   //     score: 0.057288,
//   //     tone_id: "sadness",
//   //     tone_name: "Sadness"
//   //   }
//   // ];

//   const tones = [
//     {
//       score: 0.08747,
//       tone_id: "anger",
//       tone_name: "Anger"
//     },
//     {
//       score: 0.08382,
//       tone_id: "disgust",
//       tone_name: "Disgust"
//     },
//     {
//       score: 0.295857,
//       tone_id: "fear",
//       tone_name: "Fear"
//     },
//     {
//       score: 0.452915,
//       tone_id: "joy",
//       tone_name: "Joy"
//     },
//     {
//       score: 0.153478,
//       tone_id: "sadness",
//       tone_name: "Sadness"
//     }
//   ];



//   res.render('test', {
//     red: Math.floor(rTot),
//     green: Math.floor(gTot),
//     blue: Math.floor(bTot),
//   });
// })

module.exports = router;
