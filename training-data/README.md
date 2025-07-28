# FruitAI Training Data

This directory contains 15 fruit samples for training the local AI model.

## Structure
- Each fruit has a .png image file and corresponding .json label file
- Labels include freshness scores (0-100) and detailed characteristics
- Data covers 6 fruit types: apples, bananas, oranges, strawberries, grapes, tomatoes

## Freshness Scale
- 90-100: Excellent, peak freshness
- 70-89: Good, fresh and ready to eat  
- 50-69: Fair, consume soon
- Below 50: Poor, avoid or use immediately

## Training Command
Run `npm run train-model` to train the model with this data.
