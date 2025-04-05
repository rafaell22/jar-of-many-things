# jar-of-many-things

## TODO
- ~~Make it into an electron app~~
- ~~Make drop area editable~~
- ~~Make button radius editable~~
- ~~Save data/configs~~
- ~~Load data/configs~~
- ~~Reset button~~
- ~~Button to manually drop a button~~
- ~~Remove edit points~~
- ~~Have a bigger variation on buttons sizes~~
- ~~Add parameter to the GET request that gets the chat color and then drop it with same color~~
- ~~Cache button colors to avoid having to regenerate the img every time~~
- ~~Remove buttons that fall outside the view area~~
- Add setting to toggle merge logic on/off
- Add a parameter to the GET request to have a specific button size (for example: when user check-ins X amounts of times, they get a bigger button)
- ~~Add a sound when hitting the jar and when hitting other drops~~
- Increase the size of all the objects in view and use transform/scale to try to increate the buttons resolution
- ~~Make buttons merge like Suika~~
- Interrupt the updates (pause) when no new button. restart when there is a drop WS event
- Add border aroung images (see better against stream bg)
- Add a counter for how many buttons dropped so far
- Have multiple drops types
- Create new Drop
- Edit existing Drop
- Have multiple Jars
- Save button (for the state of the jar)
- Make a vivarium that drops frogs
- Make the frogs periodically jump around

## BUGS
- Merging buttons gets janky now and then. Possible causes:
    - Jar shape (buttons have nowhere to go). Options: Change shape of the jar and see if issues happen again
    - Having a Body with dynamic size is messing up the phisycs calculations. Options: merge and then drop the button up top; look for how suika do it (since suika merges things of same size, there is more space)
    - Big buttons have too much mass and they get too much momemtum when falling (maybe the formula for calculating weght has a problem?)
    - When phisyc get crazy/janky, buttons visually disappear (render), but they are still part of the phisycs world(can see them when clicking to edit)
    - When leaving edit mode, buttons continue with the red border

## IDEAS FOR OTHER PROJECTS
### TCG check-ins
- TCG check-ins, open a booster when you check-in
- open X per day
- use bits to open more?
- extension to display collection?
- Trading?
### Extension to capture user click's
- Then do whatever you want with the data (to integrate/create other applications running locally)
### Task List
- Task list integrated with streamer.bot and twitch chat commands

