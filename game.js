window.addEventListener('load', function()
{
	var play = document.getElementById('play');
	play.addEventListener('click', playAnimation);
	function playAnimation()
	{	
		play.classList.add('hide');
		var block_left = document.getElementById('block_left');
		block_left.classList.add('shift_left');
		var block_right = document.getElementById('block_right');
		block_right.classList.add('shift_right');
		var span1 = document.getElementById('span1');
		span1.classList.add('animated1');
		var span2 = document.getElementById('span2');
		span2.classList.add('animated2');
		var span3 = document.getElementById('span3');
		span3.classList.add('animated3');
		var span4 = document.getElementById('span4');
		span4.classList.add('animated4');

		var container_score = document.getElementById('container_score');
		container_score.classList.add('visible');
		var container_level = document.getElementById('container_level');
		container_level.classList.add('visible');

		var preloaded_sound_impact = document.getElementById('preloaded_sound_impact');
		preloaded_sound_impact.play();

	
		setTimeout(runGame, 3000);
		function runGame()
		{
			var canvas = document.getElementById('myCanvas');
			var ctx = canvas.getContext('2d');
			var x = canvas.width/2;
			var y = canvas.height-30;
			var dx = 4;
			var dy = -4;
			var ballRadius = 10;
			
			var paddleHeight = 10;
			var paddleWidth = 75;
			var paddleX = (canvas.width - paddleWidth)/2;
			var rightPressed = false;
			var leftPressed = false;

			var brickRowCount = 3;
			var brickColumnCount = 5;
			var brickWidth = 75;
			var brickHeight = 20;
			var brickPadding = 10;
			var brickOffsetTop = 30;
			var brickOffsetLeft = 30;

			var score = 0;


			var bricks = [];

			for (var c = 0; c < brickColumnCount; c++)
			{
				bricks[c] = [];

				for (var r = 0; r < brickRowCount; r++)
				{
					bricks[c][r] = {x : 0, y : 0, status : 1};
				}
			}

			document.addEventListener('keydown', keyDownHandler);
			document.addEventListener('keyup', keyUpHandler);
			document.addEventListener('mousemove', mouseMoveHandler);

			function keyDownHandler(e)
			{
				if (e.keyCode == 39)
				{
					rightPressed = true;
				}

				else if (e.keyCode == 37)
				{
					leftPressed = true;
				}
			}

			function keyUpHandler(e)
			{
				if (e.keyCode == 39)
				{
					rightPressed = false;
				}

				else if (e.keyCode == 37)
				{
					leftPressed = false;
				}
			}

			function mouseMoveHandler(e)
			{
				var relativeX = e.clientX - canvas.offsetLeft + canvas.width/2;

				if (relativeX > 0 + paddleWidth/2 && relativeX < canvas.width - paddleWidth/2)
				{
					paddleX = relativeX - paddleWidth/2;
				}
			}

			function drawBall()
			{
			    ctx.beginPath();
			    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
			    ctx.fillStyle = '#0095DD';
			    ctx.fill();
			    ctx.closePath();
			}

			function drawPaddle()
			{
		    	ctx.beginPath();
		    	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
		    	ctx.fillStyle = '#0095DD';
		    	ctx.fill();
		    	ctx.closePath();
			}

			function drawBricks()
			{
				for (var c = 0; c < brickColumnCount; c++)
				{
					for (var r = 0; r < brickRowCount; r++)
					{
						if (bricks[c][r].status == 1)	
						{
							var brickX = (c*(brickWidth + brickPadding) + brickOffsetLeft);
							var brickY = (r*(brickHeight + brickPadding) + brickOffsetTop);
							bricks[c][r].x = brickX;
							bricks[c][r].y = brickY;
							ctx.beginPath();
							ctx.rect(brickX, brickY, brickWidth, brickHeight);
							ctx.fillStyle = '#0095DD';
							ctx.fill();
							ctx.closePath();
						}
					}
				}
			}

			function drawScore()
			{
				var scoreHTML = document.getElementById('score');
				scoreHTML.innerHTML = 'Score : ' + score;
			}

			function collisionDetection()
			{
				for(var c = 0; c < brickColumnCount; c++)
				{
					for(var r = 0; r < brickRowCount; r++)
					{
						var b = bricks[c][r];
						
						if (b.status == 1)
						{
							if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight)
							{
								var sound_impact = new Audio("sounds/sound_impact.mp3");
								sound_impact.play();
								dy = -dy;
								b.status = 0;
								score++;

								if (score == brickRowCount * brickColumnCount && level != 3)
								{	
									setTimeout(win, 10);
									function win() 
									{
										var sound_win = document.getElementById('sound_win');
										sound_win.play();
										var h2 = document.querySelector('h2');
										var p2 = document.getElementById('p2');
										h2.classList.add('active');
										p2.classList.add('active');
										p2.addEventListener('click', nextLevel)
										dx = 0;
										dy = 0;
										document.removeEventListener('keydown', keyDownHandler);
										document.removeEventListener('keyup', keyUpHandler);
										document.removeEventListener('mousemove', mouseMoveHandler);
									}
								}

								if (score == brickRowCount * brickColumnCount && level == 3)
								{
									var sound_win = document.getElementById('sound_win');
									sound_win.play();
									var h3 = document.querySelector('h3');
									var p3 = document.getElementById('p3');
									h3.classList.add('active');
									p3.classList.add('active');
									dx = 0;
									dy = 0;
									document.removeEventListener('keydown', keyDownHandler);
									document.removeEventListener('keyup', keyUpHandler);
									document.removeEventListener('mousemove', mouseMoveHandler);
								}
							}
						}
					}
				}
			}

			function draw()
			{
			    ctx.clearRect(0, 0, canvas.width, canvas.height);
			    drawBall();
			    drawPaddle();
			    drawBricks();
			    drawScore();
			    collisionDetection();

			    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius)
			    {
		        	dx = -dx;
		    	}
		    
		    	if (y + dy < ballRadius)
		    	{
		        	dy = -dy;
		    	}
		    
		    	else if (y + dy > canvas.height - ballRadius)
		    	{
		        	if (x > paddleX && x < paddleX + paddleWidth)
		        	{
		            	dy = -dy;
		        	}
		        
		        	else
		        	{
		            	var sound_loose = document.getElementById('sound_loose');
						sound_loose.play();
		            	var h1 = document.querySelector('h1');
		            	var p1 = document.getElementById('p1');
		            	h1.classList.add('active');
		            	p1.classList.add('active');
		            	dx = 0;
						dy = 0;
						document.removeEventListener('keydown', keyDownHandler);
						document.removeEventListener('keyup', keyUpHandler);
						document.removeEventListener('mousemove', mouseMoveHandler);
		        	}
		  	  	}

				if (rightPressed == true && paddleX < canvas.width - paddleWidth)
				{
					paddleX += 7;
				}

				else if (leftPressed == true && paddleX > 0)
				{
					paddleX -= 7;
				}

				x += dx;
			    y += dy;
				window.requestAnimationFrame(draw);
			}

			draw();

			if (level == 2)
			{
				dx += 2;
				dy -= 2;
			}
		
			if (level == 3)
			{
				dx += 4;
				dy -= 4;
			}

			var levelHTML = document.getElementById('level');
			levelHTML.innerHTML = 'Level : ' + level;
		}
		
		var level = 1;
		
		function nextLevel()
		{
			var h2 = document.querySelector('h2');
			var p2 = document.getElementById('p2');
			h2.classList.remove('active');
			p2.classList.remove('active');
			level++;
			runGame();
		}
	}
});