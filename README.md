# ColorFy

## Introduction 
ColorFy is a full stack web app that takes in a user's text input, determines the emotion of the text, and converts that into a color that suits the mood of the input. The goal of the app is to allow users to visualize their thoughts in a way that is meaningful and intuitive. 

## User Stories
### New Business Owner
John is the proud owner of a brand new boutique soap store, and recognizes the need to have a good looking website to promote his business. While he may be quite skilled in web devlopment, he has much to learn in the field of color psychology, and isn't sure which color to pick as his site's major theme. *Enter ColorFy,* the simple tool that allows John to enter his store's mission statement - or even a four page description of his store - and instantly obtain the perfect color for his site.

### Aspiring Social Worker
Sarah is a recent graduate of the prestigious social work program at the University of Michigan - Ann Arbor, and has successfully gotten an internship at a local elementary school. In an effort to better service the children under her care, she encourages her pupils to keep up a diary with her, which she then uses to analyze their moods. *Enter ColorFy,* and Sarah is now able to not only read, but actually *see* the way her charges are feeling.

## Technologies Used
* Node.js/Express.js
* MongoDB
* APIs:
    * [Watson Tone Analyzer API](http://www.ibm.com/watson/developercloud/tone-analyzer.html)
* Heroku

## Wireframes
* [Home Page](https://wireframe.cc/44JPOH)
* [Login Page](https://wireframe.cc/Mnewuj)
* [Search Page](https://wireframe.cc/LPOus6)
* [Search Results](https://wireframe.cc/Qyf7jg)

## Color Conversion
Color-fy uses a simple and intuitive algorithm for determining the color of a text. Currently, It takes the response from the Watsom API and uses the scores of the first five emotions returned, multiplying each score by its emotion's RGB color values and summing them. This method is somewhat flawed for several reasons: 
1. It doesn't take into account the 'Social Tones' of the text that Watson returns, which leads to less accurate color results.
2. It doesn't check for extrema, including results with scores of 0 or a total score that's greater than 100%. The latter issue isn't very common, and its effects are offset by the choice of colors for the emotions, as there are some emotion color values that have 0's for any one color channel.
3. The effective range of colors is smaller than the full RGB color scale, since the calculated result is an aggregate of several color values, which means that unless all the emotion scores are 0, there will always be a value for each channel in the computed color.
Future possible implementations include taking a weighted average of the scores, and checking for a certain minimum threshold of an emotion's score in order for it to be counted, and possibly even subtracting values below a certain threshold.

Below is a list of the emotional and social tones returned by the Tone Analyzer API, along with the mapping of each tone to RGB color values:

Emotional Tones:
* Anger = red = rgb(255, 0, 0)
* Disgust = purple = rgb(128, 0, 128)
* Fear = yellow = rgb(255, 255, 0)
* Joy = neon green = rgb(0, 255, 0)
* Sadness = blue = rgb(0, 0, 255)

Social Tones:
* Oppenness = white = rgb(255, 255, 255)
* Conscientiousness = brown = rgb(165, 42, 42)
* Extraversion = orange = rgb(255, 165, 0)
* Agreeableness = deep/dark green = rgb(0, 100, 0)
* Emotional Range = silver = rgb(192, 192, 192)

These colors were determined by reading up on the emotions related to colors from these websites:
http://www.do2learn.com/organizationtools/EmotionsColorWheel/
http://www.feng-shui-and-beyond.com/color-psychology.html
http://www.empower-yourself-with-color-psychology.com/meaning-of-colors.html
http://www.empower-yourself-with-color-psychology.com/business-cards.html
My choice of colors is therefore somewhat arbitrary, since I chose what made sense to me based on this limited research. Future implementations might take into account better proven, more academic research when choosing the colors.
