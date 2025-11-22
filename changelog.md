# 0.7.10 Beta -

- Remove mouse wheel control
- More accurate boat collisions and character paint cleanup
- Organise characters into `prey` and `obstacles` folders and introduce CLI tool for
  quick creation of prey and obstacles
- New obstacle: nurdles/micro-plastic
- Add Prey and Obstacles sections to level start dialog
- 

# 0.7.9.2 Beta - 19:00 UTC+1

- Add level title to level start dialog
- Fix edge case in `FloatingGuidedObstacle`'s `paint` method
- Add off-screen character (prey/obstacle) indicators on the right
- Login Invitation Dialog: Adjust `flex-direction` for the footer to `row` and
  update title to **Please Consider Logging-in**

# 0.7.9.1 Beta - 15/11/2025 9:45 UTC+1

- Refactor `merge-html-plugin` to compute full path of currently processed file
- Unify personal best and game end dialogs

# 0.7.9 Beta - 14/11/2025 11:00 UTC+1

- Convert mergeHtml script to a Vite plugin allowing for a continuous watch
  of fragment edits with recursive processing
- Readjust spacing for in-game header (Horizontal padding and space between)
- Move turtle around center
- Modify bounding box calculation to reflect character positioning on screen and
  introduce internal function for bounding box on-screen debugging
- Delete redundant method return type definitions for cleaner code along
  with other refactoring, move `index.base.html` to `src` folder and drop
  Tailwind check for `tsx` files

# 0.7.8 Beta - 08/11/2025 18:45 UTC+1

- Refactor API interfaces to match new endpoint signatures (API 0.1.5)
- Improve settings submission and game end UI response with new waiting notice
- Refine gameplay UI to include same background as in menu and place controls
  relative to gameplay section and provide a more responsive design
- Build internal HTML fragment merging pre-build tool to split up `index.base.html`
- Introduce dialog when guest player clicks Back button during game
- Extend automatic game pause for all dialogs
- Fix a couple of quirks around the _Continue Game_ menu item
- Improve look of scores dialog
- Allow for multiple dialog close handlers

# 0.7.7 Beta - 02/11/2025 18:00 UTC+1

- Migrate to vanilla JS and web components reducing the JS bundle size by over 75%
- Minor UI changes including tabbed settings dialog, smooth transitions and adopting Lucide icons
- Rename game to _Mission Sea Turtle Nest_ or _MissioIntroduce dialog when guest player clicks Back button during gamen Turtle_ in short
- Initial work on desktop notifications (currently not available in UI)
- Mobile: Add 300ms vibration on collision with obstacles
- Gameplay: Bugfix: Only handle left click on onscreen controls [#55](https://github.com/danieldesira/TurtleQuest/issues/55)
- Implement game pause on tab/window change
- Change license to GNU GPL3 and update contibutor manual
- Refactor level selection eliminating class inheritance
- Transform image uploader to a field-like `<div>` and set a 10mb limit

# 0.7.6.2 Beta (Malta&Gozo hatching Edition) - 27/08/2025 15:00 UTC+1

- [Turtle-14]: Add Vercel rewrite rule

# 0.7.6.1 Beta (Malta&Gozo hatching Edition) - 25/08/2025 17:20 UTC+1

- [Turtle-14]: Attempt to fix Vercel PWA issue

# 0.7.6 Beta (Malta&Gozo hatching Edition) - 25/08/2025 17:05 UTC+1

- Improve responsive layout in menu and a few dialogs
- Add social media config file and add YouTube
- Minor app manifest changes

# 0.7.5 Beta (Malta&Gozo hatching Edition) - 25/08/2025 13:25 UTC+1

- Add Share button in win/lose dialog
- Open login dialog on initial page load
- Move edition section to about dialog
- Adjust `/player` PUT service method to only send necessary properties in payload
- Adopt pink primary brand colour more consistently
- Upload image on profile picture change event
- Refactor request helper methods as static `Request` class
- Add player profile pictures to high scores dialog
- Rename `LoadingIndicator` to `LoadingOverlay` and increase its z-index to match dialog
- Show player profile picture in members area instead of generic icon
- Fix bug [TURTLE-10]: Reset personal best on logout
- Fix bug [TURTLE-11]: Do not show login dialog if authenticated
- New Game dialog when there is already a saved game for authenticated player

# 0.7.4 Beta - 14/08/2025 14:10 UTC+1

- Include game screenshot in build and refactor image paths
- Close login dialog on successful Google login

# 0.7.3 Beta - 14/08/2025 10:10 UTC+1

- Show _Completed_ rather than `finalLevel+1`
- Move instructions to a menu item and reformat dialog plus add a cute picture
- Logout if a request returns a 401
- Move Google SSO button to a login dialog
- Set menu background to always cover full screen
- Set brand colour in Tailwind config

# 0.7.2 Beta - 13/08/2025 00:35 UTC+1

- Fix build to include character and level background images
- Add `@static` path alias

# 0.7.1 Beta - 12/08/2025 13:15 UTC+1

- Fix dialog icon by replacing with React Icons
- Refactor api interfacing especially in points saving drastically simplifying logic

# 0.7.0 Beta - 11/08/2025 18:15 UTC+1

- Internal:
  - Switch build system to Vite from Webpack
  - Disable service worker on localhost
  - Fix React warnings
  - Configure project to read environment variables
  - Update dependencies
  - Restructure and update Redux store
  - Refactor level change types
- Player authentication:
  - Add Google login
  - Introduce high scores
  - Add personal best notification dialog
  - Move settings to online account
  - Move game progress to online account
  - Introduce player profiles
  - Introduce periodical game progress saves in `localStorage`
  - Add cookie usage notice
- Dialogs:
  - Refactor `Dialog` component and introduce `FormDialog`
  - Implement better vertical centering
  - Allow user to close through `Escape` key
  - Add 500ms transition on opacity
  - Improve button look-n-feel
  - Add turtle icon to title area
- Gameplay:
  - Pause game until dialogs are closed
  - Custom dialog messages for new levels
  - Pause game functionality

# 0.6.2 Beta - 21/09/2024 17:00 UTC+1

- Organised md documents into sections
- Fixed game play issues including level over-incrementing after restoring game
- Refactored static `Background` class into simple function exports
- Applied check to make sure character image has loaded before drawing it

# 0.6.1 Beta - 31/08/2024 19:15 UTC+1

- Fix Facebook thumbnails
- Move Instagram icon to main menu

# 0.6.0 Beta - 31/08/2024 0:15 UTC+1

- Speed up keyboard controls
- Added button to close and save current game
- Applied new theme regardless of OS options
- Boat now starts from middle of screen or beyond
- User Experience:
  - User is now forced to play in landscape mode
  - Moved controls to right hand side by default
  - New cute background design
  - Prevent accidental game close
  - Prevent text selection or touch on mobile
  - Menu reorganisation
  - Game title now also about button
- Internal:
  - Optimised character loading with `Promise.all()`
  - Code cleanups and documentation updates
  - Offline PWA
  - Excluded docs from Git repository
  - Added instructions on how to add characters in `readme.md`
  - Updated `dedications.md` and `contributors.md`
  - Character and level constructors now properly mapped

# 0.5.1 Alpha - 24/04/2024 22:45 UTC+1

- Fix dedications link
- Update packages

# 0.5.0 Alpha - 24/04/2024 22:30 UTC+1

- Mobile:
  - Correct orientation for onscreen controls
  - Fit canvas and menu in the screen when device is in landscape mode
- Disabled context menu (right click)
- Fixed bug causing control buttons to stay activated after finishing a level
- Introduced boat and associated collision detection improvements
- Moved dedications to a .md file on Github and made the logo take much less screen space
- Prevent text selection in game and menu
- Change prey direction accordingly
- Internal:
  - Document methods for abstract classes and utility functions
  - Refactored collision detection
  - Developer documentation made available at `./dev/docs`

# 0.4.3 Alpha - 03/04/2024 18:15 UTC+1

- Added a thumbnail for sharing on social media
- Locked app to landscape mode on mobile devices
- Enabled Vercel analytics

# 0.4.2 Alpha - 02/04/2024 23:15 UTC+1

- SEO
- Moved dedications to About dialog

# 0.4.1 Alpha (Easter Edition) - 31/03/2024 00:50 UTC+1

- **Loading Level** message
- New backgrounds for Level 1 and 2
- Added link to License and game logo in About dialog
- Added dedications section in menu

# 0.4.0 Alpha - 25/03/2024 19:35 UTC+1

- Redesign characters
- Code cleanup:
  - Introduced width and height properties for characters which control character image
  - Refactor `MainSection` component as 2 possible child components
- Rebrand to Turtle Quest
- Added instructions to welcome dialog
- UI changes:
  - Background colour and header text colour follow system theme scheme (dark/light)
  - Header is hidden in menu;
  - Canvas centered on bigger screens
  - Video in menu background muted
  - Replaced text in footer by About dialog

# 0.3.4 Preview - 11/03/2024 20:00 UTC+1

- Refactoring described in ticket #10
- Game menu shown by default

# 0.3.3 Preview - 09/03/2024 18:00 UTC+1

- Further characters cleanup
- Fix 0.3.2 regression: Canvas size does not restore after restarting the game

# 0.3.2 Preview - 08/03/2024 19:45 UTC+1

- Increased font size for **Play again** button and **Next level** arrow
- Centered **Play again** button and **Next level** arrow appropriately
- Stopped canvas being put on focus by default
- Reset turtle position and direction when **Play again** button is clicked
- Show baby turtles hatching video after game ends

# 0.3.1 Preview - 06/03/2024 23:05 UTC+1

- Cleanup character code
- Slow down currents and plastic bag movement
- Points gained when completing a Level
- Introduced benthic crab

# 0.3 Preview - 05/03/2024 19:35 UTC+1

- Game logic split in more and smaller classes
- Level character specification is now in the declarative format `[{ "type": string, "amount": number }]`
- Adapt swim method for prey to respond to turtle **up** and **down** directions
- Smaller dimensions for _sardine.png_ and _shrimp.png_
- Obstacle speed dependant on current speed for given level
- Enlarge **Play again** button

# 0.2.2 Preview - 23/02/2024 19:10 UTC+1

- Bug fix: Turtle visible when changing direction outside screen boundaries
- Reintroduced **up** and **down** directions and updated collision detection for such directions

# 0.2.1 Preview - 20/02/2024 17:45 UTC+1

- Introduced point system
- Realigned header components
- Added Play Again button when game ends
- Vastly sped up stomach recovery
- Show direction to the next level

# 0.2.0 Preview - 16/02/2024 17:00 UTC+1

- Refactoring:
  - Using React components and hooks
  - Introduced `Game` singleton to share turtle and level data more easily
  - Using Redux for global state management
- Introduced plastic bag
- Introduced Neptune grass as a benthic character
- Minor UI improvements
- Randomised character movement and experimental prey movement
- Improved collision detection
- Introduced stomach capacity meter

# 0.1.2 Preview - 29/01/2024 19:40 UTC+1

- Massive refactor
- Introduced breathing and oxygen level

# 0.1.1 Preview - 28/01/2024 13:45 UTC+1

- Fix: Could not load small fish image on GH Pages environment
- Improved error and character image handling

# 0.1.0 Preview - 28/01/2024 12:30 UTC+1

- Food and damage meters
- Shrimp and small fish as additional characters
- Code cleanup and ability to "eat"

# 0.0.10 Preview - 19/01/2024 23:30 UTC+1

- Resolved regression not completing the last level and code cleanup making the flow more readable
- Attempt to disable zoom when tapping controls on mobile
- Attempt to lock orientation to landscape on mobile

# 0.0.9 Preview - 18/01/2024 17:45 UTC+1

- Removed orientation check
- Added web app manifest.json
- Optimized image rendering for backgrounds and turtle
- Onscreen controls are now much larger
- Code cleanup

# 0.0.8 Preview - 17/01/2024 17:05 UTC+1

- Detection of device orientation and asking users to play in landscape mode
- Increased size for onscreen controls

# 0.0.7 Preview - 16/01/2024 23:40 UTC+1

- Code cleanup
- Tripled turtle speed
- Solved issue where level was sometimes automatically "completed" due to fetching background width prematurely
- Introduced onscreen controls

# 0.0.6 Preview - 14/01/2024 23:45 UTC+1

- Demo of switching from a level to the next
- Included dialog library used in Daniel's Connect4
- Installed and configured Tailwind
- Some general styling improvements

# 0.0.5 Preview - 11/01/2024 23:15 UTC+1

- Resize canvas depending on window size
- Demo turtle observer `function`

# 0.0.4 Preview - 10/01/2024 23:00 UTC+1

- Background moves with turtle
- Set upper limits for turtle movement
- Shifted initial turtle position a little to the right

# 0.0.3 Preview - 08/01/2024 17:00 UTC+1

- Respond to any pointing device on browsers with `PointerEvent` support (Edge/Chrome)

# 0.0.2 Preview - 05/01/2024 12:15 UTC+1

- Prevent default touch behavior

# 0.0.1 Preview - 04/01/2024 23:15 UTC+1

- Added experimental support for touchscreen swipes

# 0.0.0 Preview - 03/01/2024

- Initial version with turtle movable by keyboard or mouse wheel/touchpad gestures
