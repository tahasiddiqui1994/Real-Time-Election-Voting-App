const form = document.getElementById('vote-form') ;

form.addEventListener('submit', (event) => {
    const choice = document.querySelector('input[name=party]:checked').value ;
    //console.log('Choice: ', choice) ;
    const data = { party: choice }

    fetch('http://localhost:3000/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        /*.then(function(res) {return res.json()})
        .then(function(data) { return console.log(data)})
        .catch('Boom!!!') ;*/
        
        /*.then((res) => {return res.json()})
        .then((data) => { return console.log(data)})
        .catch('Boom!!!') ;*/

        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch('Boom!!!') ;

    event.preventDefault() ;
}) ;
//var EachVoteCount = {} ;
fetch('http://localhost:3000/poll', {method: 'get'})
    .then(res => res.json())
    .then(data => {
        const votes = data.votes ;
        const totalVotes = votes.length ;
        console.log('Votes: ', votes) ;
        // Each vote count for party
        const EachVoteCount = votes.reduce(
            (acc, vote) =>
                ((acc[vote.party] = (acc[vote.party] || 0) + parseInt(vote.points)), acc), {}) ;
        
        console.log('Type: ',typeof EachVoteCount) ;
        console.log('EachVoteCount: ',EachVoteCount) ;

        let dataPoints = [
            { label: 'PTI', y: EachVoteCount.PTI },
            { label: 'PMLN', y: EachVoteCount.PMLN },
            { label: 'PPP', y: EachVoteCount.PPP },
            { label: 'MQM', y: EachVoteCount.MQM },
            { label: 'MMA', y: EachVoteCount.MMA },
            { label: 'TLP', y: EachVoteCount.TLP },
            { label: 'Others', y: EachVoteCount.Others }
        ] ;

        const chartContainer = document.querySelector('#chartContainer') ;
        
        if(chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title: {
                    text: `Total Votes: ${totalVotes}`
                },
                data: [{
                    type: 'column',
                    dataPoints: dataPoints
                }]
            }) ;
            chart.render() ;
            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true ;
        
            var pusher = new Pusher('e5e9f33d0e9cae96e992', {
                cluster: 'us2',
                encrypted: true
            });

            var channel = pusher.subscribe('party-poll') ;
            channel.bind('party-vote', function(data) {
                //console.log('Data:', data) ;
                dataPoints = dataPoints.map(x => {
                    //console.log('X: ', x) ;
                    if (x.label == data.party) {
                        x.y += data.points ;
                        return x ;
                    } else {
                        return x ;
                    }
                }) ;
                chart.render() ;
            }) ;
        }
        
    })
    .catch(err => {
        console.log('Error:', err)
    }) ;
