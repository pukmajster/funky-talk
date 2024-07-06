# The Scripts

The talker scripts we need are stored in the game's various game content folders:

- hl2
- left4dead2
- left4dead2_dlc1
- left4dead2_dlc2
- left4dead2_dlc3
- update

All of these folders contain VPKs that hold many of these talker scripts, but they're all over the place.

Let's take a look at Coach's talker scripts. Coach has his base `coach.txt` talker script in the `left4dead2` base game content
directory, and a smaller `coach_dlc1.txt` talker script for all the The Passing exclusive voice lines in `left4dead_dlc1`,
but then he has another `coach.txt` talker script in the `update` folder where the two previously mentioned talker scripts are essentially merged into one.

# Content Load Order

Here it's important to understand how the game loads its files. More can be found by reading up on the [SearchPaths](https://developer.valvesoftware.com/wiki/Gameinfo.txt#SearchPaths) article. The base game has the following SearchPaths:

```
SearchPaths
{
  Game				update
  Game				left4dead2_dlc3
  Game				left4dead2_dlc2
  Game				left4dead2_dlc1
  Game				left4dead2
  Game				hl2
}
```

This means that when the game looks for the `coach.txt` talker script, it'll first try finding it in the `update` folder, then going down the list until it finds it.

Since I'm lazy, I took the simple approach of simply copying the talker scripts of each content folder into one folder, starting with `hl2` and going up the `SearchPaths` list up to `update` and overriding any duplicates along the way. I can only hope this gives me the accurate files to work with.
