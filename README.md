# Funky Talk

This project aims to extract and organize all of L4D2's voice lines into something that can be used for other projects, such as custom vocalizer wheels in Funky.

# Response System

I suggest reading up on the [Response System](https://developer.valvesoftware.com/wiki/Response_System) documented on the Valve Developer Community.

Other relevant Valve Developer Community topics:

- [Concept](https://developer.valvesoftware.com/wiki/Concept)
- [Criterion](https://developer.valvesoftware.com/wiki/Criterion)
- [Context](https://developer.valvesoftware.com/wiki/Context)
- [Rule](https://developer.valvesoftware.com/wiki/Rule)
- [Response](https://developer.valvesoftware.com/wiki/Response)

# The Process

## Extracting Game Files

First we need to extract all relevant talker scripts from the game's VPKs'. We then store these raw scripts in the `1 source-files` folder. These scripts contain every voice line definition within the game.

## Transformation

Next we take all these scripts and transform their data into something more accessible, readable, and usable. We're essentially taking the original scripts and converting them to JSON, which we'll save in `2 transformed-files`.
