var column = 10; 
var rows = 20;
var board = [];
var shape;
var x_cor;
var y_cor;
var movement;
var win;
var interval;
var intervalRender;
var colors = ['purple', 'orange', 'blue', 'cyan', 'yellow', 'red', 'pink'];
var shape_helper = [[0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0 ], [ 0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0 ], [ 0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0 ], [ 0,0,0,0, 0,1,1,0, 0,0,1,1, 0,0,0,0], [ 0,0,0,0, 0,1,1,1, 0,1,0,0, 0,0,0,0], [0,0,0,0, 0,1,1,1, 0,0,0,1, 0,0,0,0], [0,0,0,0, 0,1,1,1, 0,0,1,0, 0,0,0,0]];

var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var canvas2 = canvas.getContext('2d');

var W = 256, H = 512;
var blk_w = W/column, blk_h = H/rows;

document.body.onkeydown = function(input)
{
	check_key(input.keyCode);
	render();
};

function check_key(key)
{
	if(key == 37) // left
	{
		if(check_position(-1))
		{
			x_cor--;
		}
	}
	else if(key == 38) // rotate
	{
		var new_shape = [];
		for (var i = 0; i < 4; i++) 
		{
			new_shape[i] = [];
			for (var j = 0; j < 4; j++) 
			{
				new_shape[i][j] = shape[3-j][i];
			}
		}
		if(check_position(0,0,new_shape))
		{
			shape = new_shape;
		}
	}
	else if(key == 39) // right
	{
		if(check_position(1))
		{
			x_cor++;
		}
	}
	else if(key == 40) // down
	{
		if(check_position(0,1))
		{
			y_cor++;
		}
	}
	else if(key == 82) // r
	{

		start_game();
	}
	else if(key == 81) // q
	{
		close();
	}
}


function render() 
{
	canvas2.clearRect( 0, 0, W, H );
	canvas2.strokeStyle = 'grey';

	for (var i = 0; i < column; i++) 
	{
		for (var j = 0; j < rows; j++) 
		{
            if(board[j][i])
			{
				canvas2.fillStyle = colors[board[j][i] - 1];
				canvas2.fillRect(blk_w*i, blk_h*j, blk_w-1, blk_h-1);
				canvas2.strokeRect(blk_w*i, blk_h*j, blk_w-1, blk_h-1);
			}
		}		
	}
	canvas2.stroke();
			
	canvas2.fillStyle = 'red';
	canvas2.strokeStyle = 'black';
	for (var j = 0; j < 4; j++) 
	{
		for (var i = 0; i < 4; i++) 
		{
			if(shape[j][i])
			{
				canvas2.fillStyle = colors[shape[j][i] - 1];
				canvas2.fillRect(blk_w*( x_cor+ i), blk_h*(y_cor+j), blk_w-1, blk_h-1);
				canvas2.strokeRect(blk_w*( x_cor+ i), blk_h*(y_cor+j), blk_w-1, blk_h-1);
			}
		}		
	}
}

function make_shape()
{
	var random = Math.floor(Math.random() * shape_helper.length);
	var shape1 = shape_helper[random];
	shape = [];
	for (var i = 0; i < 4; i++) 
	{
		shape[i] = [];
		for (var j = 0; j < 4; j++) 
		{
			if (typeof shape1[4*i+j] != 'undefined' && shape1[4*i+j]) 
			{
				shape[i][j] = random+1;
			}	
			else
			{
				shape[i][j] = 0;
			}
		}
	}

	movement = true;
	x_cor = 5;
	y_cor = -2; 
}

function move_shape()
{
	if(check_position(0,1))
	{
		y_cor++;
	}

	else
	{
		for (var i = 0; i < 4; i++) 
		{
			for (var j = 0; j < 4; j++) 
			{
				if(shape[i][j])
				{
					board[y_cor+i][x_cor+j] = shape[i][j];
				}
			}
		}
		movement = false;
		check_position(0,1);
		check_line_complete();
		if(!win)
		{
			clearInterval(interval);
			clearInterval(intervalRender);
			return false;	
		}
		make_shape();
	}
}

function check_line_complete()
{
	for (var i = rows-1; i>=0 ; i--) 
	{
		var filled = true;
		for (var j = 0; j < column; j++) {
			if(board[i][j] == 0)
			{
				filled = false;
				break;
			}
		}

		if (filled) 
		{
			for (var i1 = i ; i1 > 0; i1--) {
				for (var j1 = 0; j1 < column; j1++) {
					board[i1][j1] = board[i1-1][j1];
				}
			}
			i++;
		}
	}
}

function check_position(x, y, final_shape)
{
	x = x || 0;
	y = y|| 0;
	x = x_cor + x;
	y = y_cor + y;
	final_shape = final_shape || shape;

	for (var i = 0; i < 4; i++) 
	{
		for (var j = 0; j < 4; j++) 
		{
			if (final_shape[i][j]) 
			{
				if (typeof board[i+y] == 'undefined'  || typeof board[i+y][j+x] == 'undefined'
					|| board[i+y][j+x] || j+x < 0 || i+y >= rows || j+x >=column) 
				{
					if (y == 0 && movement == false) 
					{
						win = false;
					}
					return false;
				}
			}
		}
	}
	return true;
}

function start_game()
{
	canvas2.strokeStyle = 'grey';

	for (var i = 0; i < column; i++) 
	{
		canvas2.moveTo(i*25.6, 0);
        canvas2.lineTo(i*25.6, H);
            
		for (var j = 0; j < rows; j++) 
		{
			canvas2.moveTo(0, j*25.6);
        	canvas2.lineTo(W, j*25.6);
		}		
	}
	canvas2.stroke();
	

	clearInterval(interval);
	clearInterval(intervalRender);
	intervalRender = setInterval(render, 20);
	for ( var y = 0; y < rows; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < column; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
	make_shape();
	win = true;
	interval = setInterval(move_shape, 400);
}

start_game();