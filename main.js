//to do:
//  optimize the algo

var player;
var opponent;
var myMove = false;

var board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

//displays modal
$('.play').click(function () {
  $('.modal').css("display", "block");
});

$('.O').click(function () {
  $('.modal').css("display", "none");
  $('body').css("cursor", "pointer");
  player = 'O';
  opponent = 'X';
  resetGame();
  main();
});

$('.X').click(function () {
  $('.modal').css("display", "none");
  $('body').css("cursor", "pointer");
  player = 'X';
  opponent = 'O';
  resetGame();
  main();
});

function main() {
  $(".col-xs-4").click(function () {
    if ($(this).is(':empty')) {
      var cell = $(this).attr("id");
      var row = parseInt(cell[1]);
      var col = parseInt(cell[2]);
      if (!myMove) {
        board[row][col] = false;
        myMove = true;
        newMove();
        makeMove();
      }
    }
  });
}

function checkWin(board) {
  vals = [true, false];
  var allNotNull = true;
  for (var k = 0; k < vals.length; k++) {
    var value = vals[k];
    var diagonalComplete1 = true;
    var diagonalComplete2 = true;
    //checks diagonals for win
    for (var i = 0; i < 3; i++) {
      if (board[i][i] != value) {
        diagonalComplete1 = false;
      }
      if (board[2 - i][i] != value) {
        diagonalComplete2 = false;
      }
      //checks rows and columns for win
      var rowComplete = true;
      var colComplete = true;
      for (var j = 0; j < 3; j++) {
        if (board[i][j] != value) {
          rowComplete = false;
        }
        if (board[j][i] != value) {
          colComplete = false;
        }
        if (board[i][j] === null) {
          allNotNull = false;
        }
      }
      if (rowComplete || colComplete) {
        return value ? 1 : 0;
      }
    }
    if (diagonalComplete1 || diagonalComplete2) {
      return value ? 1 : 0;
    }
  }
  if (allNotNull) {
    return -1;
  }
  return null;
}

function resetGame() {
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  myMove = false;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      $("#" + "b" + i + "" + j).text("").css("background", "#222");
    }
  }
  $('h3').css("display", "none").text("");
}

function newMove() {
  newSymbol();
  var winner = checkWin(board);
  if (winner === 1) {
    $('h3').css("display", "block").append(opponent + " won!").addClass("animated infinite pulse");
    markWin();
    //displays the result for 1.5 seconds before the game resets
    setTimeout(resetGame, 2000);
  } else if (winner === 0) {
    $('h3').css("display", "block").append(player + ' won!').addClass("animated infinite pulse");
    markWin();
    setTimeout(resetGame, 2000);
  } else if (winner === -1) {
    $('h3').css("display", "block").append("It's a Draw!").addClass("animated infinite pulse");
    setTimeout(resetGame, 2000);
  }

}

function newSymbol() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] === false && $("#" + "b" + i + "" + j).is(':empty')) {
        $("#" + "b" + i + "" + j).text(player);
      } else if (board[i][j] === true && $("#" + "b" + i + "" + j).is(':empty')) {
        $("#" + "b" + i + "" + j).text(opponent);
      }
    }
  }
}

//marks the winning row/column/diagonal with green blocks
function markWin() {
  var arr = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
  ];
  for (var i = 0; i < arr.length; i++) {
    if ($('.' + 'b' + arr[i][0] + ':contains("O")').length > 0 && $('.' + 'b' + arr[i][1] + ':contains("O")').length > 0 && $('.' + 'b' + arr[i][2] + ':contains("O")').length > 0) {
      $('.' + 'b' + arr[i][0]).css("background", "green");
      $('.' + 'b' + arr[i][1]).css("background", "green");
      $('.' + 'b' + arr[i][2]).css("background", "green");
      i = arr.length;
    }
  } //checks O win
  for (var j = 0; j < arr.length; j++) {
    if ($('.' + 'b' + arr[j][0] + ':contains("X")').length > 0 && $('.' + 'b' + arr[j][1] + ':contains("X")').length > 0 && $('.' + 'b' + arr[j][2] + ':contains("X")').length > 0) {
      $('.' + 'b' + arr[j][0]).css("background", "green");
      $('.' + 'b' + arr[j][1]).css("background", "green");
      $('.' + 'b' + arr[j][2]).css("background", "green");
      j = arr.length;
    }
  } //checks X win
  return false;
}

//[0,0] [0,1] [0,2]
//[1,0] [1,1] [1,2]
//[2,0] [2,1] [2,2]

function minimax(board, player) {
  nodes++;
  var winner = checkWin(board);
  if (winner !== null) {
    switch (winner) {
      case 1:
        // AI wins
        return [1, board];
      case 0:
        // opponent wins
        return [-1, board];
      case -1:
        // Tie
        return [0, board];
    }
  } else {
    // Next states
    var nextVal = null;
    var nextBoard = null;

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          board[i][j] = player;
          var value = minimax(board, !player)[0];
          if ((player && (nextVal === null || value > nextVal)) || (!player && (nextVal === null || value < nextVal))) {
            nextBoard = board.map(function (arr) {
              return arr.slice();
            });
            nextVal = value;
          }
          board[i][j] = null;
        }
      }
    }
    return [nextVal, nextBoard];
  }
}

function minimaxMove(board) {
  nodes = 0;
  return minimax(board, true)[1];
}

function makeMove() {
  board = minimaxMove(board);
  // console.log(nodes);
  myMove = false;
  if (nodes !== 1) {
    newMove();
  }
}