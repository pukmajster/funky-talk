# Funky Talk

This project aims to extract and organize all of L4D2's voice lines into something that can be used for other projects, such as custom vocalizer wheels in Funky.

# About Talker Scripts

Relevant Valve Developer Community topics:

- [Criterion](https://developer.valvesoftware.com/wiki/Criterion)
- [Response](https://developer.valvesoftware.com/wiki/Response)
- [Rule](https://developer.valvesoftware.com/wiki/Rule)

Talker scripts contain all the dialog the game's characters speak. Every voice line has a list of possible audio clips the character will say, a set of conditions that must be met in order for the dialog to play, and possibly a reference to the next voice line to play within any give dialog.

- A criterion is a list of conditions that must be met for a voice line to play (e.g. if the character is Nick and is playing Survival)
- A response block is a list of possible voice lines a character can say with a subsequent response to play after (should a different character respond to a played voice line)
- A rule block contains a list of rules and settings to apply to a response, utilizing criterions

# The Process

## Extracting Game Files

First we need to extract all relevant talker scripts from the game's VPKs'. We then store these raw scripts in the `source-files` folder. These scripts contain every voice line definition within the game.

## Transformation

Next we take all these scripts and transform their data into something more accessible, readable, and usable. We're essentially taking the original scripts and converting them to JSON, which we'll save in `transformed-files`.
