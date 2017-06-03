$(document).ready(function() {

  var squares = ['sp1', 'sp2', 'sp3', 'sp4', 'sp5', 'sp6', 'sp7', 'sp8', 'sp9'];
  var winningConditions = [['sp1', 'sp2', 'sp3'],['sp1', 'sp4', 'sp7'],['sp1', 'sp5', 'sp9'],['sp2', 'sp5', 'sp8'],['sp3', 'sp6', 'sp9'],['sp3', 'sp5', 'sp7'],['sp4', 'sp5', 'sp6'],['sp7', 'sp8', 'sp9']];
  var win = false;
  var moveCount = 0;

  var player = {
    "name":'You',
    "symbol":'X',
    "squares":[],
    "wins":0,
    "losses":0,
    "goesFirst":true
  };

  var computer = {
    "name":'Computer',
    "symbol":'O',
    "squares":[],
    "wins":0,
    "losses":0,
    "goesFirst":false
  };

  var restart = function () {
    $('.square').html('');
    player.squares = [];
    computer.squares = [];
    moveCount = 0;
    win = false;
  }

  // *** Test conditions for win ***
  var checkForWin = function (squareArray, playerName) {
    for (var i = 0; i < winningConditions.length; i++) {
      var matchCount = 0;
      for (var j = 0; j < 3; j++) {
        if (squareArray.indexOf(winningConditions[i][j]) >= 0)
          matchCount++;
        if (matchCount == 3) {
          win = true;
          $('.splash').css('z-index', 1);
          return true;
        }
      }
    }
  }

  // *** Computer move ***
  var computerMove = function() {
    var move = Math.floor(Math.random()*10) + 1;
    while ($('#sp' + move).html() != '')
      move = Math.floor(Math.random()*10) + 1;
    computer.squares.push('sp' + move);
    $('#sp' + move).html(computer.symbol);
  }

  $('.square').click(function() {
    if (win === false && moveCount < 9) {
      if ($(this).html() == '') {
        moveCount++;
        player.squares.push($(this).attr('ID'));
        $(this).html(player.symbol);
        if (checkForWin(player.squares, player.name)) {
          player.wins++;
          $('.result').html('You win!');
          $('.question').html('Play again?');

          $('#playerScore').html(player.wins);
        }

        if (win === false && moveCount < 9) {
          moveCount++;
          computerMove();
          if (checkForWin(computer.squares, computer.name) === true) {
            computer.wins++;
            $('.result').html('You lose!');
            $('.question').html('Play again?');
            $('#computerScore').html(computer.wins);
          }
        }

        if (win === false && moveCount == 9) {
          console.log('Stalemate!');
          win = true;
        }
      }
    }
  });

  $('.first').click(function() {
    player.goesFirst = true;
    $('.splash').css('z-index', -1);
    restart();
  });

  $('.last').click(function() {
    player.goesFirst = false;
    $('.splash').css('z-index', -1);
    restart();
    computerMove();
  });

  $('.exit').click(function() {
    if (player.wins > computer.wins)
      window.location = 'http://www.dictionary.com/browse/winner';
    else if (player.wins < computer.wins)
      window.location = 'http://www.dictionary.com/browse/loser';
    else
      window.location = 'http://www.dictionary.com/browse/stalemate';
  })
});
