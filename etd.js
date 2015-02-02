
// TODO
// REFACTOR!


// NICE TO HAVES
// display: inline-block for train color
// service advisory api
// pass a config object to functions
// cache dom selectors
// clean up the css
// flip direction on clicking direction
// reload on click
// change var names from origin/dest to home/work
// nix leaveSoon?
// clean up comments & logs
// explain how trips requiring transfers work
// add bullet to indicate bart system colors for each train. check css
  //bad validation & little accounting for edge cases
  //  customize Font Awesome 4.2.0 using LESS or SASS.


  // trade reduced features for convenience.
  // for this convenience your have smaller audience, restricted capability

/*


#1, #2, #3, #4, #5, #n




a 1 - 10000
b 2 - 01000
c 1 & 2 - 11000
d 3
e 1 & 2 & 3
f 1 & 3
g 2 & 3




encode options to one character

*/

$(function() {


var stations = {
  '12TH': '12th St. / Oakland City Center',
  '16TH': '16th St. Mission',
  '19TH': '19th St. Oakland',
  '24TH': '24th St. Mission',
  'ASHB': 'Ashby',
  'BALB': 'Balboa Park',
  'BAYF': 'Bay Fair',
  'CAST': 'Castro Valley',
  'CIVC': 'Civic Center',
  'COLS': 'Coliseum / Oakland Airport',
  'COLM': 'Colma',
  'CONC': 'Concord',
  'DALY': 'Daly City',
  'DBRK': 'Downtown Berkeley',
  'DUBL': 'Dublin / Pleasanton',
  'DELN': 'El Cerrito del Norte',
  'PLZA': 'El Cerrito Plaza',
  'EMBR': 'Embarcadero',
  'FRMT': 'Fremont',
  'FTVL': 'Fruitvale',
  'GLEN': 'Glen Park',
  'HAYW': 'Hayward',
  'LAFY': 'Lafayette',
  'LAKE': 'Lake Merritt',
  'MCAR': 'MacArthur',
  'MLBR': 'Millbrae',
  'MONT': 'Montgomery',
  'NBRK': 'North Berkeley',
  'NCON': 'North Concord / Martinez',
  'ORIN': 'Orinda',
  'PITT': 'Pittsburg / Bay Point',
  'PHIL': 'Pleasant Hill',
  'POWL': 'Powell',
  'RICH': 'Richmond',
  'ROCK': 'Rockridge',
  'SBRN': 'San Bruno',
  'SANL': 'San Leandro',
  'SFIA': 'SFO Airport',
  'SHAY': 'South Hayward',
  'SSAN': 'South San Francisco',
  'UCTY': 'Union City',
  'WCRK': 'Walnut Creek',
  'WDUB': 'West Dublin / Pleasanton',
  'WOAK': 'West Oakland',
  'SPCL': 'Special'
}

// var  parseURL = function() {
  var URLhash = window.location.hash.split('');

  var URLorigin = URLhash.slice(1,5).join('');
  var URLdestination = URLhash.slice(6,10).join('');
  var allFlag = false;

  if (URLhash[11] === 'a' || URLhash[11] === 'A') {
    allFlag = true;
  }

  if (URLhash.length < 1) {
    window.location.href="setup.html"; 
  }

  if (stations[URLorigin] === undefined || stations[URLdestination] === undefined) {
    alert('the url you entered appear to be malformed. please retry.');
  }

  var homeLeaveSoon = 99; 
  var homeTooLate = parseInt(URLhash[5], 36); 

  var workLeaveSoon = 99; 
  var workTooLate = parseInt(URLhash[10], 36);

  var origin = URLorigin;
  var destination = URLdestination;

  var leaveSoon = homeLeaveSoon; 
  var tooLate = homeTooLate; 

  var currentTime = new Date().getHours();

  if (currentTime > 12 || currentTime < 3) {
    leaveSoon = workLeaveSoon; 
    tooLate = workTooLate;
    origin = URLdestination;
    destination = URLorigin;
  }

var getTrainDirection = function() {
  $.ajax({ 
    type:'GET', 
    url:'http://api.bart.gov/api/sched.aspx?cmd=depart&orig=' + origin + '&dest=' + destination + '&date=now&b=2&a=4', 
    dataType:'xml', 
    success: function(xml){ 
      var trainHeadings = [];
      $(xml).find('leg').each(function(){
        trainHeadings.push($(this).attr('trainHeadStation'));
      });
      console.log(trainHeadings);
      getTrains(trainHeadings);
    }
  });
};


var getTrains = function(trainHeadings) { 
  var trains = []; 
  $.ajax({ 
    type:'GET', 
    url:'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + origin + '&key=Z5LP-U799-IDSQ-DT35', 
    dataType:'xml', 
    success: function(xml){ 
      var trainIndex = 0;
      $(xml).find('etd').each(function(){
        var abbreviatedDestination = $(this).find('abbreviation').text();
        var destination = $(this).find('destination').text();
        if (trainHeadings.indexOf(abbreviatedDestination) > -1) {
          $(this).find('estimate').each(function(){
            trains[trainIndex] = [];
            var minutes = parseInt($(this).find('minutes').text())
            if (isNaN(minutes)) {
              minutes = 0;
            }
            trains[trainIndex].push(
              abbreviatedDestination, 
              destination,
              minutes,
              $(this).find('length').text(),
              $(this).find('hexcolor').text()
              );
            trainIndex += 1;
          });
        }
      });

      trains.sort(function(a, b) {
        if (a[2] < b[2]) return -1
        else if (a[2] > b[2]) return 1
        return 0;
      });
      console.log(trains);
      updateDisplay(trains);
    }
  });
};

var updateDisplay = function(trains) {

  var currentTrainIndex = getCurrentTrainIndex(trains, tooLate);

  // set colors from cold to hot as minutes count down to convey urgency
  var currentTrainMinutes = trains[currentTrainIndex][2];
  var etdColor = '';
  if (currentTrainMinutes >= tooLate + 7) {
    etdColor = '#3f51b5';
  } else if (currentTrainMinutes === tooLate + 6) {
    etdColor = '#5677fc';
  } else if (currentTrainMinutes === tooLate + 5) {
    etdColor = '#03a9f4';
  } else if (currentTrainMinutes === tooLate + 4) {
    etdColor = '#00BCD4';
  } else if (currentTrainMinutes === tooLate + 3) {
    etdColor = '#009688';    
  } else if (currentTrainMinutes === tooLate + 2) {
    etdColor = '#259b24';
  } else if (currentTrainMinutes === tooLate + 1) {
    etdColor = '#ff9800';
  } else if (currentTrainMinutes === tooLate) {
    etdColor = '#e51c23';
  }

  // if a station name is too long add a carriage return
  var carriageReturn = '';
  if (stations[origin].length > 16 || stations[destination].length > 16) {
    carriageReturn = '<br/>';
  }

  // if 'all' flag display all the trains
  if (allFlag) {
    var pastTrains = '';
    for (var i = 0; i < currentTrainIndex; i++) {
      pastTrains += '<div class="past-etd">' + trains[i][2] + 
      ' min - ' + trains[i][3] + ' cars - ' + trains[i][1] + '</div>';
    }
    $('.past-etd-container').empty().append(pastTrains);
  }

  // show minutes for first train higher than tooLate
  $('.train-direction').html(stations[origin] + ' to ' + carriageReturn + stations[destination]).css('background-color', etdColor);
  $('.current-etd').text(currentTrainMinutes).css('background-color', etdColor);
  $('.current-etd-text').text(trains[currentTrainIndex][1] + ' - ' + trains[currentTrainIndex][3] + ' cars').css('background-color', etdColor);

  // show future trains
  var upcomingTrains = '';
  for (var j = currentTrainIndex + 1; j < trains.length; j++) {
    upcomingTrains += '<div class="future-etd">' + trains[j][2] + 
    ' min - ' + trains[j][3] + ' cars - ' + '<span style="color:' + trains[j][4] + '">' + trains[j][1] + '</span>' + '</div>';
  }
  $('.future-etd-container').empty().append(upcomingTrains);
};


var getCurrentTrainIndex = function(trains, tooLate) {
  var trainIndex;
  for (var i = 0; i < trains.length; i++) {
  // account for the last train of the day
    if (trains[i][2] >= tooLate) {
      return i;
    }
  }
  return trainIndex;
}


getTrainDirection();
var intervalID = window.setInterval(getTrainDirection, 15000);

});

