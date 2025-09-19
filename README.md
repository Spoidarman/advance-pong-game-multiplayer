# 🏓 Advanced Pong - Three.js Edition

An enhanced version of the classic Pong game built with Three.js featuring advanced scoring mechanics, two-player local multiplayer, and modern visual effects.

### 🎯 Game Modes
- **2-Player Local**: Play with a friend using separate controls
- **vs CPU**: Challenge an intelligent AI opponent
- **Customizable Win Conditions**: Set target score from 10-200 points

### ⚡ Advanced Scoring System
- **Base Goal Points**: 10 points per goal
- **Rally Bonus**: Extra points for extended rallies (3+ consecutive hits)
- **Speed Bonus**: Reward quick ball returns (under 1 second)
- **Perfect Hit Bonus**: 15 points for center paddle hits
- **Edge Hit Bonus**: 8 points for challenging edge shots
- **Multiplier System**: Build up to 5.0x score multiplier through consecutive hits
- **Streak Tracking**: Monitor winning streaks for competitive play

### 🎨 Visual Enhancements
- **Particle Effects**: Dynamic particles on collisions and scoring
- **Screen Shake**: Responsive feedback on paddle hits
- **Gradient Background**: Modern aesthetic design
- **Real-time Statistics**: Live tracking of bonuses and multipliers
- **Responsive Design**: Adapts to any screen size

### 🎮 Advanced Controls
- **Player 1**: W (up), S (down), Left Shift (speed boost)
- **Player 2**: Arrow Up (up), Arrow Down (down), Right Shift (speed boost)
- **Game Controls**: Space (start), ESC (pause), R (reset), N (new game)

## 🚀 Quick Start

### Prerequisites
- Modern web browser with WebGL support
- No additional dependencies required - runs entirely in browser

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Spoidarman/advance-pong-game-multiplayer.git
   cd advance-pong-game-multiplayer
   ```

2. **Open the game**
   ```bash
   # Simply open index.html in your browser
   # Or serve with a local server:
   python -m http.server 8000
   # Navigate to http://localhost:8000
   ```

3. **Start Playing!**
   - Choose your game mode (2-Player or vs CPU)
   - Use the controls listed above
   - First player to reach the target score wins!

## 🎲 How to Play

### Basic Gameplay
1. **Choose Mode**: Select 2-Player Local or vs CPU
2. **Set Target Score**: Adjust win condition (default: 50 points)
3. **Start Game**: Press Space to serve the ball
4. **Control Paddles**: Use your assigned keys to move up/down
5. **Speed Boost**: Hold Shift for faster paddle movement
6. **Score Goals**: Hit the ball past your opponent's paddle

### Scoring Strategy
- **Rally Building**: Keep the ball in play for rally bonuses
- **Quick Returns**: React fast for speed bonuses
- **Precise Hits**: Aim for paddle center for perfect hit bonuses
- **Maintain Streaks**: Chain goals together for higher multipliers

## 🛠️ Technical Details

### Built With
- **Three.js r128**: 3D graphics library for WebGL rendering
- **Vanilla JavaScript**: Pure JS implementation for maximum compatibility
- **HTML5 Canvas**: Responsive rendering
- **CSS3**: Modern styling and animations

### Architecture
- **Orthographic Camera**: 2D perspective for classic Pong gameplay
- **Particle System**: Dynamic visual effects
- **Advanced Physics**: Realistic ball movement and collision detection
- **State Management**: Game modes, scoring, and progression tracking

### Performance Features
- **60 FPS Target**: Smooth gameplay on modern devices
- **Efficient Rendering**: Optimized Three.js scene management
- **Memory Management**: Automatic cleanup of particles and effects
- **Responsive Design**: Scales to any screen resolution

## 🎯 Game Mechanics

### Collision System
- **Paddle Detection**: Precise hit detection with position-based angle variation
- **Border Bouncing**: Realistic physics for top/bottom wall collisions
- **Speed Variation**: Ball speed increases slightly with each paddle hit

### AI Behavior
- **Adaptive Difficulty**: CPU responds to ball position with slight delay
- **Realistic Movement**: Mimics human-like paddle control
- **Balanced Challenge**: Provides engaging competition without being unbeatable

## 🎨 Customization

### Visual Themes
- **Player Colors**: Player 1 (Green), Player 2 (Pink)
- **Dynamic Opacity**: Visual feedback for speed boosts
- **Particle Colors**: Match player colors for clear identification

### Gameplay Tweaks
- **Win Score**: Adjustable from 10-200 points
- **Ball Speed**: Configurable base and maximum speeds
- **Paddle Speed**: Normal and boost speed settings
- **Scoring Values**: Customizable bonus point values

## 📊 Scoring Breakdown

| Action | Base Points | Bonus Conditions |
|--------|-------------|------------------|
| Goal | 10 | Base scoring |
| Rally Bonus | +2 per hit | 3+ consecutive hits |
| Speed Bonus | +5 | Return under 1 second |
| Perfect Hit | +15 | Center paddle contact |
| Edge Hit | +8 | Edge paddle contact |
| Multiplier | 1.0x - 5.0x | Consecutive successful hits |

## 🔧 Development

### File Structure
```
advanced-pong-threejs/
├── index.html
├── styles.css
├── app.js          # Main game file (single file implementation)
├── README.md          # This documentation
└── LICENSE           # MIT License
```

### Extending the Game
The single-file architecture makes it easy to modify:
- **Scoring System**: Adjust `SCORING` constants
- **Visual Effects**: Modify particle systems and colors
- **Game Physics**: Tune ball speed and collision detection
- **Controls**: Add new control schemes in `CONTROLS` object

## 🐛 Known Issues

- **Mobile Support**: Touch controls not implemented (desktop only)
- **Audio**: No sound effects (visual feedback only)
- **Networking**: Local multiplayer only (no online play)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎖️ Acknowledgments

- **Three.js Community**: For the excellent 3D graphics library
- **Classic Pong**: Inspiration from the 1972 Atari original
- **Modern Gaming**: Advanced scoring mechanics inspired by contemporary games

## 🌟 Future Enhancements

- [ ] **Mobile Support**: Touch controls for mobile devices
- [ ] **Sound Effects**: Audio feedback for hits and scoring
- [ ] **Tournament Mode**: Multi-round competitions
- [ ] **Online Multiplayer**: WebSocket-based networking
- [ ] **Custom Themes**: Visual customization options
- [ ] **Replay System**: Record and playback games
- [ ] **Statistics**: Historical performance tracking

***

**Enjoy playing Advanced Pong!** 🏓

*For questions, issues, or feature requests, please open a GitHub issue.*

