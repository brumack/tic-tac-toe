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
    var squareSort = [];
    var squareCounts = [];
    var bestMove = [];
    var counter = 0;


    // *** checks for 2 spaces to a winningCondition and makes winning move
    for (i = 0; i < remainingWinningConditions.length; i++) {
      counter = 0;
      for (j = 0; j < computer.squares.length; j++) {
        if (remainingWinningConditions[i].indexOf(computer.squares[j]) != -1)
          counter++;
        if (counter == 2) {
          for (k = 0; k < 3; k++)
            if ($('#'+remainingWinningConditions[i][k]).html() == '')
              return remainingWinningConditions[i][k];
        }
      }
    }

    // *** checks for 2 spaces to a winningCondition for player and then blocks
    for (var i = 0; i < winningConditions.length; i++) {
      counter = 0;
      for (var j = 0; j < player.squares.length; j++) {
        if (winningConditions[i].indexOf(player.squares[j]) != -1)
          counter++;
        if (counter == 2) {
          console.log('player has 2');
          for (var k = 0; k < 3; k++)
            if ($('#'+winningConditions[i][k]).html() == '')
              return winningConditions[i][k];
        }
      }
    }


      // *** determines remaining possible solutions and creates array ***
      for (i = 0; i < remainingWinningConditions.length; i++)
        for (j = 0; j < player.squares.length; j++)
          if (remainingWinningConditions[i].indexOf(player.squares[j]) != -1) {
            remainingWinningConditions.splice(i,1);
            i--;
            j = player.squares.length;
          }
    if (remainingWinningConditions.length > 0) {
      // *** breaks down 2-dimensional array into one array of spaces ***
      for (i = 0; i < remainingWinningConditions.length; i++)
        squareSort = squareSort.concat(remainingWinningConditions[i])


      // *** creates new two-dimensional array with first value an occurance
      //   count of the second value (spaces) - (ie [2,sp3] meaning 2 counts of sp3) ***
      while (squareSort.length > 0) {
        squareCounts.unshift([1]);
        squareCounts[0].push(squareSort[0]);
        squareSort.splice(0,1);
        while (squareSort.indexOf(squareCounts[0][1]) != -1) {
          squareCounts[0][0]++;
          squareSort.splice(squareSort.indexOf(squareCounts[0][1]),1);
        }
      }

      // *** removes any spaces already occupied by the computer
      for (i = 1; i < squareCounts.length; i++)
        if ($('#'+squareCounts[i][1]).html() != '') {
          squareCounts.splice(i,1)
          i--;
        }

      //*** sorts the remaining data so that the most frequently occuring space(s)
      //lay at the end of the array. Then returns the last space in the array***
      squareCounts.sort()
      console.log('squareCounts', squareCounts);
      return squareCounts[squareCounts.length-1][1];
    }
    else {
      return squares[(Math.round(Math.random()*10)%squares.length)];
    }
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
    console.log('squares', squares.length);
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

      if (squares.length == 0) {
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
