        // Game variables
        let scene, camera, renderer;
        let player1Paddle, player2Paddle, ball;
        let gameStarted = false;
        let gamePaused = false;
        let gameMode = 'menu';
        let winScore = 50;
        let keys = {};
        let particles = [];
        let rallyCount = 0;
        let ballSpeed = 0.6;
        
        // Advanced scoring system [web:44][web:46][web:47]
        let player1Stats = {
            score: 0,
            totalScore: 0,
            rallyBonus: 0,
            speedBonus: 0,
            streak: 0,
            multiplier: 1.0,
            lastHitTime: 0,
            consecutiveHits: 0
        };
        
        let player2Stats = {
            score: 0,
            totalScore: 0,
            rallyBonus: 0,
            speedBonus: 0,
            streak: 0,
            multiplier: 1.0,
            lastHitTime: 0,
            consecutiveHits: 0
        };
        
        let ballVelocity = { x: 0, y: 0 };
        let lastBallHit = Date.now();
        
        // Game constants
        const GAME_WIDTH = 100;
        const GAME_HEIGHT = 60;
        const PADDLE_WIDTH = 0.7;
        const PADDLE_HEIGHT = 8;
        const BALL_SIZE = 0.8;
        const BASE_BALL_SPEED = 0.6;
        const PADDLE_SPEED = 1.0;
        const PADDLE_BOOST_SPEED = 1.8;
        const MAX_BALL_SPEED = 1.5;
        
        // Scoring constants [web:46][web:47]
        const SCORING = {
            BASE_GOAL: 10,
            RALLY_MULTIPLIER: 2,
            SPEED_BONUS_THRESHOLD: 1.0,
            SPEED_BONUS_POINTS: 5,
            STREAK_MULTIPLIER: 0.1,
            MAX_MULTIPLIER: 5.0,
            PERFECT_HIT_BONUS: 15,
            EDGE_HIT_BONUS: 8
        };

        // Corrected control mappings as requested [web:25][web:26]
        const CONTROLS = {
            player1: {
                up: ['KeyW'],
                down: ['KeyS'],
                boost: ['ShiftLeft']
            },
            player2: {
                up: ['ArrowUp'],
                down: ['ArrowDown'],
                boost: ['ShiftRight']
            },
            game: {
                start: ['Space'],
                pause: ['Escape'],
                reset: ['KeyR'],
                newGame: ['KeyN']
            }
        };

        function init() {
            // Create scene
            scene = new THREE.Scene();

            // Create orthographic camera for 2D view
            const aspect = window.innerWidth / window.innerHeight;
            const frustumSize = GAME_HEIGHT;
            camera = new THREE.OrthographicCamera(
                -frustumSize * aspect / 2, frustumSize * aspect / 2,
                frustumSize / 2, -frustumSize / 2,
                1, 1000
            );
            camera.position.z = 10;

            // Create renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x001122, 1);
            document.body.appendChild(renderer.domElement);

            createPaddles();
            createBall();
            createBorders();
            setupEventListeners();
            animate();
        }

        function createPaddles() {
            const paddleGeometry = new THREE.PlaneGeometry(PADDLE_WIDTH, PADDLE_HEIGHT);
            
            const paddle1Material = new THREE.MeshBasicMaterial({ 
                color: 0x00ff88,
                transparent: true,
                opacity: 0.9
            });
            
            player1Paddle = new THREE.Mesh(paddleGeometry, paddle1Material);
            player1Paddle.position.x = -GAME_WIDTH/2 + 8;
            player1Paddle.position.y = 0;
            scene.add(player1Paddle);

            const paddle2Material = new THREE.MeshBasicMaterial({ 
                color: 0xff4488,
                transparent: true,
                opacity: 0.9
            });
            
            player2Paddle = new THREE.Mesh(paddleGeometry, paddle2Material);
            player2Paddle.position.x = GAME_WIDTH/2 - 8;
            player2Paddle.position.y = 0;
            scene.add(player2Paddle);
        }

        function createBall() {
            const ballGeometry = new THREE.PlaneGeometry(BALL_SIZE, BALL_SIZE);
            const ballMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffff00,
                transparent: true,
                opacity: 0.95
            });
            
            ball = new THREE.Mesh(ballGeometry, ballMaterial);
            resetBall();
            scene.add(ball);
        }

        function createBorders() {
            const borderMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x444466,
                transparent: true,
                opacity: 0.7
            });
            
            // Top and bottom borders
            const topBorder = new THREE.Mesh(
                new THREE.PlaneGeometry(GAME_WIDTH, 2),
                borderMaterial
            );
            topBorder.position.y = GAME_HEIGHT/2;
            scene.add(topBorder);

            const bottomBorder = new THREE.Mesh(
                new THREE.PlaneGeometry(GAME_WIDTH, 2),
                borderMaterial
            );
            bottomBorder.position.y = -GAME_HEIGHT/2;
            scene.add(bottomBorder);

            // Center line
            for (let i = -GAME_HEIGHT/2; i < GAME_HEIGHT/2; i += 6) {
                const centerLine = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.8, 3),
                    borderMaterial
                );
                centerLine.position.x = 0;
                centerLine.position.y = i;
                scene.add(centerLine);
            }
        }

        function setupEventListeners() {
            document.addEventListener('keydown', (event) => {
                keys[event.code] = true;
                
                if (CONTROLS.game.start.includes(event.code) && !gameStarted && gameMode !== 'menu') {
                    startBall();
                    event.preventDefault();
                } else if (CONTROLS.game.pause.includes(event.code) && gameMode !== 'menu') {
                    togglePause();
                    event.preventDefault();
                } else if (CONTROLS.game.reset.includes(event.code) && gameMode !== 'menu') {
                    resetGame();
                    event.preventDefault();
                } else if (CONTROLS.game.newGame.includes(event.code)) {
                    newGame();
                    event.preventDefault();
                }
            });

            document.addEventListener('keyup', (event) => {
                keys[event.code] = false;
            });

            // Prevent default browser shortcuts
            document.addEventListener('keydown', (event) => {
                if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
                    event.preventDefault();
                }
            });

            window.addEventListener('resize', onWindowResize);
        }

        function startGame(mode) {
            gameMode = mode;
            document.getElementById('game-mode').style.display = 'none';
            resetGame();
        }

        function changeWinScore(delta) {
            winScore = Math.max(10, Math.min(200, winScore + delta));
            document.getElementById('win-score').textContent = winScore;
        }

        function newGame() {
            gameMode = 'menu';
            document.getElementById('game-mode').style.display = 'block';
            resetGame();
        }

        function togglePause() {
            gamePaused = !gamePaused;
        }

        function startBall() {
            if (gamePaused) return;
            
            gameStarted = true;
            rallyCount = 0;
            const angle = (Math.random() - 0.5) * Math.PI / 4;
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            ballVelocity.x = Math.cos(angle) * BASE_BALL_SPEED * direction;
            ballVelocity.y = Math.sin(angle) * BASE_BALL_SPEED;
            ballSpeed = BASE_BALL_SPEED;
            lastBallHit = Date.now();
        }

        function resetBall() {
            ball.position.x = 0;
            ball.position.y = 0;
            ballVelocity.x = 0;
            ballVelocity.y = 0;
            gameStarted = false;
            rallyCount = 0;
            ballSpeed = BASE_BALL_SPEED;
        }

        function resetGame() {
            // Reset all scoring stats [web:44]
            player1Stats = {
                score: 0, totalScore: 0, rallyBonus: 0, speedBonus: 0, 
                streak: 0, multiplier: 1.0, lastHitTime: 0, consecutiveHits: 0
            };
            player2Stats = {
                score: 0, totalScore: 0, rallyBonus: 0, speedBonus: 0, 
                streak: 0, multiplier: 1.0, lastHitTime: 0, consecutiveHits: 0
            };
            
            updateScoreDisplay();
            resetBall();
            gamePaused = false;
        }

        function isKeyPressed(keyArray) {
            return keyArray.some(key => keys[key]);
        }

        function updatePaddles() {
            if (gamePaused) return;

            // Player 1 controls (W/S + Left Shift) [web:25]
            const p1Speed = isKeyPressed(CONTROLS.player1.boost) ? PADDLE_BOOST_SPEED : PADDLE_SPEED;
            
            if (isKeyPressed(CONTROLS.player1.up)) {
                player1Paddle.position.y = Math.min(
                    player1Paddle.position.y + p1Speed,
                    GAME_HEIGHT/2 - PADDLE_HEIGHT/2
                );
                player1Paddle.material.opacity = isKeyPressed(CONTROLS.player1.boost) ? 1.0 : 0.9;
            }
            if (isKeyPressed(CONTROLS.player1.down)) {
                player1Paddle.position.y = Math.max(
                    player1Paddle.position.y - p1Speed,
                    -GAME_HEIGHT/2 + PADDLE_HEIGHT/2
                );
                player1Paddle.material.opacity = isKeyPressed(CONTROLS.player1.boost) ? 1.0 : 0.9;
            }

            // Player 2 controls (Arrow Up/Down + Right Shift) [web:25]
            if (gameMode === '2player') {
                const p2Speed = isKeyPressed(CONTROLS.player2.boost) ? PADDLE_BOOST_SPEED : PADDLE_SPEED;
                
                if (isKeyPressed(CONTROLS.player2.up)) {
                    player2Paddle.position.y = Math.min(
                        player2Paddle.position.y + p2Speed,
                        GAME_HEIGHT/2 - PADDLE_HEIGHT/2
                    );
                    player2Paddle.material.opacity = isKeyPressed(CONTROLS.player2.boost) ? 1.0 : 0.9;
                }
                if (isKeyPressed(CONTROLS.player2.down)) {
                    player2Paddle.position.y = Math.max(
                        player2Paddle.position.y - p2Speed,
                        -GAME_HEIGHT/2 + PADDLE_HEIGHT/2
                    );
                    player2Paddle.material.opacity = isKeyPressed(CONTROLS.player2.boost) ? 1.0 : 0.9;
                }
            } else if (gameMode === 'cpu') {
                // CPU AI
                const cpuTarget = ball.position.y;
                const cpuSpeed = PADDLE_SPEED * 0.8;
                const tolerance = 2;
                
                if (player2Paddle.position.y < cpuTarget - tolerance) {
                    player2Paddle.position.y = Math.min(
                        player2Paddle.position.y + cpuSpeed,
                        GAME_HEIGHT/2 - PADDLE_HEIGHT/2
                    );
                } else if (player2Paddle.position.y > cpuTarget + tolerance) {
                    player2Paddle.position.y = Math.max(
                        player2Paddle.position.y - cpuSpeed,
                        -GAME_HEIGHT/2 + PADDLE_HEIGHT/2
                    );
                }
            }
        }

        function updateBall() {
            if (!gameStarted || gamePaused) return;

            ball.position.x += ballVelocity.x;
            ball.position.y += ballVelocity.y;

            // Border collisions
            if (ball.position.y >= GAME_HEIGHT/2 - BALL_SIZE/2 || 
                ball.position.y <= -GAME_HEIGHT/2 + BALL_SIZE/2) {
                ballVelocity.y = -ballVelocity.y;
                createParticleEffect(ball.position.x, ball.position.y, 0x888888);
            }

            // Paddle collisions with advanced scoring [web:46][web:47]
            checkPaddleCollision(player1Paddle, player1Stats, 'player1');
            checkPaddleCollision(player2Paddle, player2Stats, 'player2');

            // Scoring when ball goes off screen
            if (ball.position.x < -GAME_WIDTH/2) {
                scoreGoal(player2Stats, 'player2');
                resetBall();
            } else if (ball.position.x > GAME_WIDTH/2) {
                scoreGoal(player1Stats, 'player1');
                resetBall();
            }

            // Update ball visual based on speed
            const currentSpeed = Math.sqrt(ballVelocity.x * ballVelocity.x + ballVelocity.y * ballVelocity.y);
            ball.material.opacity = 0.8 + (currentSpeed / MAX_BALL_SPEED) * 0.2;
        }

        function checkPaddleCollision(paddle, playerStats, playerId) {
            const ballLeft = ball.position.x - BALL_SIZE/2;
            const ballRight = ball.position.x + BALL_SIZE/2;
            const ballTop = ball.position.y + BALL_SIZE/2;
            const ballBottom = ball.position.y - BALL_SIZE/2;

            const paddleLeft = paddle.position.x - PADDLE_WIDTH/2;
            const paddleRight = paddle.position.x + PADDLE_WIDTH/2;
            const paddleTop = paddle.position.y + PADDLE_HEIGHT/2;
            const paddleBottom = paddle.position.y - PADDLE_HEIGHT/2;

            if (ballRight > paddleLeft && ballLeft < paddleRight &&
                ballTop > paddleBottom && ballBottom < paddleTop) {
                
                // Calculate advanced collision scoring [web:46][web:47]
                const currentTime = Date.now();
                const timeSinceLastHit = currentTime - lastBallHit;
                const hitPosition = (ball.position.y - paddle.position.y) / (PADDLE_HEIGHT/2);
                
                // Rally bonus system [web:46]
                rallyCount++;
                if (rallyCount > 3) {
                    playerStats.rallyBonus += Math.floor(rallyCount / 2) * SCORING.RALLY_MULTIPLIER;
                    showBonusPopup(`Rally Bonus! +${Math.floor(rallyCount / 2) * SCORING.RALLY_MULTIPLIER}`);
                }
                
                // Speed bonus for quick returns [web:46]
                if (timeSinceLastHit < 1000) {
                    playerStats.speedBonus += SCORING.SPEED_BONUS_POINTS;
                    showBonusPopup(`Speed Bonus! +${SCORING.SPEED_BONUS_POINTS}`);
                }
                
                // Perfect hit bonus (center of paddle) [web:47]
                if (Math.abs(hitPosition) < 0.2) {
                    playerStats.totalScore += SCORING.PERFECT_HIT_BONUS;
                    showBonusPopup(`Perfect Hit! +${SCORING.PERFECT_HIT_BONUS}`);
                } else if (Math.abs(hitPosition) > 0.7) {
                    playerStats.totalScore += SCORING.EDGE_HIT_BONUS;
                    showBonusPopup(`Edge Hit! +${SCORING.EDGE_HIT_BONUS}`);
                }
                
                // Update multiplier based on consecutive hits [web:46][web:47]
                playerStats.consecutiveHits++;
                const newMultiplier = Math.min(
                    1.0 + (playerStats.consecutiveHits * SCORING.STREAK_MULTIPLIER),
                    SCORING.MAX_MULTIPLIER
                );
                playerStats.multiplier = newMultiplier;
                
                // Show multiplier if > 1.0
                if (newMultiplier > 1.0) {
                    const multiplierDisplay = document.getElementById('multiplier-display');
                    multiplierDisplay.textContent = `${newMultiplier.toFixed(1)}x MULTIPLIER`;
                    multiplierDisplay.style.opacity = '1';
                    setTimeout(() => {
                        multiplierDisplay.style.opacity = '0';
                    }, 1500);
                }
                
                updateScoreDisplay();
                
                // Physics
                ballVelocity.x = -ballVelocity.x * 1.02;
                ballVelocity.y += hitPosition * BASE_BALL_SPEED * 0.3;
                
                // Limit ball speed
                const currentSpeed = Math.sqrt(ballVelocity.x * ballVelocity.x + ballVelocity.y * ballVelocity.y);
                if (currentSpeed > MAX_BALL_SPEED) {
                    ballVelocity.x = (ballVelocity.x / currentSpeed) * MAX_BALL_SPEED;
                    ballVelocity.y = (ballVelocity.y / currentSpeed) * MAX_BALL_SPEED;
                }
                
                createParticleEffect(ball.position.x, ball.position.y, 
                    playerId === 'player1' ? 0x00ff88 : 0xff4488);
                
                lastBallHit = currentTime;
                
                // Reset opponent's streak
                const opponentStats = playerId === 'player1' ? player2Stats : player1Stats;
                opponentStats.consecutiveHits = 0;
                opponentStats.multiplier = 1.0;
            }
        }

        function scoreGoal(playerStats, playerId) {
            // Advanced goal scoring system [web:44][web:46][web:47]
            let goalPoints = SCORING.BASE_GOAL;
            
            // Apply rally bonus
            goalPoints += playerStats.rallyBonus;
            
            // Apply speed bonus
            goalPoints += playerStats.speedBonus;
            
            // Apply multiplier
            goalPoints = Math.floor(goalPoints * playerStats.multiplier);
            
            // Add to total score
            playerStats.score += 1; // Basic score for UI
            playerStats.totalScore += goalPoints;
            playerStats.streak++;
            
            // Reset bonuses
            playerStats.rallyBonus = 0;
            playerStats.speedBonus = 0;
            
            // Reset opponent's streak and bonuses
            const opponentStats = playerId === 'player1' ? player2Stats : player1Stats;
            opponentStats.streak = 0;
            opponentStats.consecutiveHits = 0;
            opponentStats.multiplier = 1.0;
            opponentStats.rallyBonus = 0;
            opponentStats.speedBonus = 0;
            
            showBonusPopup(`GOAL! +${goalPoints} points`);
            updateScoreDisplay();
            checkWinCondition();
            
            createParticleEffect(ball.position.x, ball.position.y, 
                playerId === 'player1' ? 0x00ff88 : 0xff4488);
        }

        function showBonusPopup(text) {
            const popup = document.getElementById('bonus-popup');
            popup.textContent = text;
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1.2)';
            
            setTimeout(() => {
                popup.style.opacity = '0';
                popup.style.transform = 'translate(-50%, -50%) scale(1.0)';
            }, 1500);
        }

        function updateScoreDisplay() {
            // Update main scores
            document.getElementById('player1Score').textContent = player1Stats.score;
            document.getElementById('player2Score').textContent = player2Stats.score;
            
            // Update advanced stats [web:47]
            document.getElementById('p1-total').textContent = player1Stats.totalScore;
            document.getElementById('p1-rally').textContent = player1Stats.rallyBonus;
            document.getElementById('p1-speed').textContent = player1Stats.speedBonus;
            document.getElementById('p1-streak').textContent = player1Stats.streak;
            document.getElementById('p1-multiplier').textContent = player1Stats.multiplier.toFixed(1) + 'x';
            
            document.getElementById('p2-total').textContent = player2Stats.totalScore;
            document.getElementById('p2-rally').textContent = player2Stats.rallyBonus;
            document.getElementById('p2-speed').textContent = player2Stats.speedBonus;
            document.getElementById('p2-streak').textContent = player2Stats.streak;
            document.getElementById('p2-multiplier').textContent = player2Stats.multiplier.toFixed(1) + 'x';
        }

        function createParticleEffect(x, y, color) {
            for (let i = 0; i < 8; i++) {
                const particle = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.4, 0.4),
                    new THREE.MeshBasicMaterial({ 
                        color: color,
                        transparent: true,
                        opacity: 0.9
                    })
                );
                particle.position.x = x + (Math.random() - 0.5) * 3;
                particle.position.y = y + (Math.random() - 0.5) * 3;
                particle.velocity = {
                    x: (Math.random() - 0.5) * 0.3,
                    y: (Math.random() - 0.5) * 0.3
                };
                particle.life = 40;
                
                scene.add(particle);
                particles.push(particle);
            }
        }

        function updateParticles() {
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                particle.position.x += particle.velocity.x;
                particle.position.y += particle.velocity.y;
                particle.material.opacity *= 0.92;
                particle.life--;
                
                if (particle.life <= 0 || particle.material.opacity < 0.01) {
                    scene.remove(particle);
                    particles.splice(i, 1);
                }
            }
        }

        function checkWinCondition() {
            if (player1Stats.totalScore >= winScore || player2Stats.totalScore >= winScore) {
                const winner = player1Stats.totalScore >= winScore ? 'Player 1' : 
                              (gameMode === '2player' ? 'Player 2' : 'CPU');
                
                setTimeout(() => {
                    alert(`${winner} Wins!\nFinal Score: ${player1Stats.totalScore} - ${player2Stats.totalScore}`);
                    resetGame();
                }, 100);
            }
        }

        function onWindowResize() {
            const aspect = window.innerWidth / window.innerHeight;
            const frustumSize = GAME_HEIGHT;
            
            camera.left = -frustumSize * aspect / 2;
            camera.right = frustumSize * aspect / 2;
            camera.top = frustumSize / 2;
            camera.bottom = -frustumSize / 2;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            
            updatePaddles();
            updateBall();
            updateParticles();
            
            renderer.render(scene, camera);
        }

        // Start the game
        init();