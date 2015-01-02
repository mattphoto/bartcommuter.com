var bartAPIKey = 'MW9S-E7SL-26DU-VV8V';

function updateBARTDepartures(){
  var bart = [];

  $.ajax({
    url: 'http://api.bart.gov/api/etd.aspx',
    data: {
      cmd: 'etd',
      orig: 'woak',
      key: bartAPIKey
    },
    dataType: 'xml',
    success:function(data){

      console.log(data);
      // $('#bart-north, #bart-south').empty();

      $(result).find('etd').each(function(i, data){
        console.log(i, data);
        //Process directions
        // departure = addDirection(data);
        // if(departure){
        //   bart.push(departure);
        // }
      });

      // //Sort departures
      // bart.sort(bartSortHandler);

      // bart.forEach(function(departure){
      //   $(departure.div).appendTo( (departure.direction == 'North') ? $('#bart-north') : $('#bart-south'));
      // });
    }
  });
}
updateBARTDepartures();



///////////////////////////////////////////////////
/*
http://api.bart.gov/docs/sched/depart.aspx
1. get departure info for current time then extract the trainHeadStation="SFIA" info.
2. but etd only returns       <destination>Fremont</destination> 
3. return etds where trainHeadStation === <abbreviation>MLBR</abbreviation>

*/
