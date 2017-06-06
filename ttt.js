$(document).ready(function() {

  var squares = ['sp1', 'sp2', 'sp3', 'sp4', 'sp5', 'sp6', 'sp7', 'sp8', 'sp9'];
  var winningConditions = [['sp1', 'sp2', 'sp3'],['sp1', 'sp4', 'sp7'],['sp1', 'sp5', 'sp9'],['sp2', 'sp5', 'sp8'],['sp3', 'sp6', 'sp9'],['sp3', 'sp5', 'sp7'],['sp4', 'sp5', 'sp6'],['sp7', 'sp8', 'sp9']];
  var remainingWinningConditions = [['sp1', 'sp2', 'sp3'],['sp1', 'sp4', 'sp7'],['sp1', 'sp5', 'sp9'],['sp2', 'sp5', 'sp8'],['sp3', 'sp6', 'sp9'],['sp3', 'sp5', 'sp7'],['sp4', 'sp5', 'sp6'],['sp7', 'sp8', 'sp9']];
  var possibleWins = []

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
    squares = ['sp1', 'sp2', 'sp3', 'sp4', 'sp5', 'sp6', 'sp7', 'sp8', 'sp9'];
    remainingWinningConditions = [['sp1', 'sp2', 'sp3'],['sp1', 'sp4', 'sp7'],['sp1', 'sp5', 'sp9'],['sp2', 'sp5', 'sp8'],['sp3', 'sp6', 'sp9'],['sp3', 'sp5', 'sp7'],['sp4', 'sp5', 'sp6'],['sp7', 'sp8', 'sp9']];
    player.squares = [];
    computer.squares = [];
  }

  var calculate = function() {
    for (var i = 0; i < remainingWinningConditions.length; i++)
      for (var j = 0; j < player.squares.length; j++)
        if (remainingWinningConditions[i].indexOf(player.squares[j]) != -1) {
          remainingWinningConditions.splice(i,1);
          i--;
          j = player.squares.length;
        }

    var squareSort = [];

    for (i = 0; i < remainingWinningConditions.length; i++)
      squareSort = squareSort.concat(remainingWinningConditions[i])



    var counts = [];

    console.log(squareSort);
    while (squareSort.length > 0) {
      counts.unshift([1]);
      counts[0].push(squareSort[0]);
      squareSort.splice(0,1);
      while (squareSort.indexOf(counts[0][1]) != -1) {
        counts[0][0]++;
        squareSort.splice(squareSort.indexOf(counts[0][1]),1);
      }
    }
    counts.sort();

    for (i = 1; i < counts.length; i++) {
      if ($('#'+counts[i][1]).html() != '') {
        counts.splice(i,1)
        i--;
      }
    }

    console.log(counts);
    return counts[counts.length-1][1];
/*
    var character = [];
    var count = [];


    while (squareSort.length > 0) {
      character.unshift(squareSort[0])
      squareSort.splice(0,1)
      count.unshift(1);
      while (squareSort.indexOf(character[0]) != -1) {
        count[0]++;
        squareSort.splice(squareSort.indexOf(character[0]),1);
      }
    }
    console.log('character', character);
    console.log('count', count);
*/

  }


  // *** Test conditions for win ***
  var checkForWin = function (squareArray) {
    var matchCount = 0;

    for (var i = 0; i < winningConditions.length; i++) {
      matchCount = 0;
      for (var j = 0; j < 3; j++)
        if (squareArray.indexOf(winningConditions[i][j]) != -1)
          matchCount++;
      if (matchCount == 3)
        return true;
    }
    return false;
  }

  // *** Computer move ***
  var computerMove = function() {
    move = calculate();
    //var move = Math.floor(Math.random()*10) + 1;
    //while ($('#sp' + move).html() != '')
      //move = Math.floor(Math.random()*10) + 1;
    computer.squares.push(move);
    squares.splice(squares.indexOf(move),1);
    $('#' + move).html(computer.symbol);
  }

  $('.square').click(function() {
    if (squares.indexOf($(this).attr('ID')) != -1) {
      player.squares.push($(this).attr('ID'));
      squares.splice(squares.indexOf($(this).attr('ID')),1);
      $(this).html(player.symbol);

      if (checkForWin(player.squares) == true) {
        player.wins++;
        $('.result').html('You win!');
        $('.question').html('Play again?');
        $('#playerScore').html(player.wins);
        $('.splash').css('z-index', 1);
      }

      else if (squares.length > 0) {
        computerMove();
        if (checkForWin(computer.squares) == true) {
          computer.wins++;
          $('.result').html('You lose!');
          $('.question').html('Play again?');
          $('#computerScore').html(computer.wins);
          $('.splash').css('z-index', 1);
        }
      }

      else if (squares.length == 0) {
        $('.result').html('Stalemate');
        $('.question').html('Play again?');
        $('#computerScore').html(computer.wins);
        $('.splash').css('z-index', 1);
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
